import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Purchase from '@/models/Purchase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test');
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  console.log('Stripe webhook event:', event.type);
  console.log('Event data:', JSON.stringify(event.data.object, null, 2));

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      await dbConnect();
      
      await Purchase.create({
        session_id: session.metadata?.sessionId || session.id,
        session_title: session.metadata?.sessionTitle || 'Unknown Session',
        user_email: session.customer_email || 'guest@example.com',
        amount_paid: session.amount_total / 100,
        currency: session.currency?.toUpperCase() || 'USD',
        payment_status: 'completed',
        stripe_payment_intent_id: session.payment_intent,
        access_granted: true,
        purchase_date: new Date()
      });

      console.log('Purchase recorded successfully via webhook');
    } catch (error) {
      console.error('Error recording purchase:', error);
    }
  }

  return NextResponse.json({ received: true });
}