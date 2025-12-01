import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Purchase from '@/models/Purchase';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Disable body parsing for webhooks
export const runtime = 'nodejs';

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' }, 
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        // Handle subscription payments if needed
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handle subscription events if needed
        break;
        
      default:
        // Unhandled event type
    }

    return NextResponse.json({ received: true, processed: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed', eventId: event.id },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session) {
  try {
    // Check if purchase already exists to prevent duplicates
    const existingPurchase = await Purchase.findOne({
      stripe_payment_intent_id: session.payment_intent
    });
    
    if (existingPurchase) {
      return;
    }

    // Get detailed payment information
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    const paymentMethod = paymentIntent.charges?.data[0]?.payment_method_details;
    
    // Get transaction fee details
    const stripeFee = paymentIntent.charges?.data[0]?.balance_transaction 
      ? await stripe.balanceTransactions.retrieve(paymentIntent.charges.data[0].balance_transaction)
      : null;
    
    const transactionFee = stripeFee ? stripeFee.fee / 100 : 0;
    const netAmount = (session.amount_total / 100) - transactionFee;

    const purchaseData = {
      session_id: session.metadata?.sessionId || session.id,
      session_title: session.metadata?.sessionTitle || 'Unknown Session',
      user_email: session.customer_email || session.metadata?.userEmail || 'guest@example.com',
      user_name: session.metadata?.userName || session.customer_details?.name || '',
      amount_paid: session.amount_total / 100,
      currency: session.currency?.toUpperCase() || 'USD',
      payment_status: 'completed',
      stripe_payment_intent_id: session.payment_intent,
      stripe_checkout_session_id: session.id,
      payment_method: paymentMethod?.type || 'card',
      transaction_fee: transactionFee,
      net_amount: netAmount,
      customer_ip: paymentIntent.charges?.data[0]?.outcome?.network_status || null,
      billing_address: {
        country: session.customer_details?.address?.country,
        postal_code: session.customer_details?.address?.postal_code,
        state: session.customer_details?.address?.state,
        city: session.customer_details?.address?.city,
        line1: session.customer_details?.address?.line1,
        line2: session.customer_details?.address?.line2,
      },
      payment_details: {
        card_brand: paymentMethod?.card?.brand,
        card_last4: paymentMethod?.card?.last4,
        card_exp_month: paymentMethod?.card?.exp_month,
        card_exp_year: paymentMethod?.card?.exp_year,
        card_country: paymentMethod?.card?.country,
      },
      access_granted: true,
      purchase_date: new Date(session.created * 1000),
    };

    await Purchase.create(purchaseData);
    
  } catch (error) {
    // Log error to purchase record if possible
    try {
      await Purchase.findOneAndUpdate(
        { stripe_payment_intent_id: session.payment_intent },
        { 
          $set: {
            error_details: {
              error_code: error.code || 'WEBHOOK_ERROR',
              error_message: error.message,
              error_date: new Date()
            }
          }
        },
        { upsert: false }
      );
    } catch (logError) {
      // Silent fail for error logging
    }
    
    throw error;
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  try {
    // Update purchase status if it exists
    const purchase = await Purchase.findOne({
      stripe_payment_intent_id: paymentIntent.id
    });
    
    if (purchase && purchase.payment_status !== 'completed') {
      purchase.payment_status = 'completed';
      purchase.access_granted = true;
      await purchase.save();
    }
    
  } catch (error) {
    throw error;
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    // Get failure details
    const failureCode = paymentIntent.last_payment_error?.code;
    const failureMessage = paymentIntent.last_payment_error?.message;
    const declineCode = paymentIntent.last_payment_error?.decline_code;
    
    // Update or create purchase record with failure details
    const purchaseUpdate = {
      payment_status: 'failed',
      access_granted: false,
      error_details: {
        error_code: failureCode || declineCode || 'PAYMENT_FAILED',
        error_message: failureMessage || 'Payment failed',
        error_date: new Date()
      }
    };
    
    const purchase = await Purchase.findOneAndUpdate(
      { stripe_payment_intent_id: paymentIntent.id },
      { $set: purchaseUpdate },
      { new: true, upsert: false }
    );
    
    if (!purchase) {
      // Create failed purchase record if it doesn't exist
      const failedPurchaseData = {
        session_id: paymentIntent.metadata?.sessionId || 'unknown',
        session_title: paymentIntent.metadata?.sessionTitle || 'Unknown Session',
        user_email: paymentIntent.metadata?.userEmail || 'unknown@example.com',
        user_name: paymentIntent.metadata?.userName || '',
        amount_paid: paymentIntent.amount / 100,
        currency: paymentIntent.currency?.toUpperCase() || 'USD',
        payment_status: 'failed',
        stripe_payment_intent_id: paymentIntent.id,
        access_granted: false,
        error_details: {
          error_code: failureCode || declineCode || 'PAYMENT_FAILED',
          error_message: failureMessage || 'Payment failed',
          error_date: new Date()
        },
        purchase_date: new Date(paymentIntent.created * 1000),
      };
      
      await Purchase.create(failedPurchaseData);
    }
    
  } catch (error) {
    throw error;
  }
}