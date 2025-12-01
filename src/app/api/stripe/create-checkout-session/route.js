import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Session from '@/models/Session';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    // Verify user authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { sessionId, successUrl, cancelUrl } = await request.json();

    // Validate required fields
    if (!sessionId || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    
    // Get session details from database
    const sessionData = await Session.findById(sessionId);
    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Validate price
    const price = sessionData.price || 0;
    if (price <= 0) {
      return NextResponse.json({ error: 'Invalid session price' }, { status: 400 });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: (sessionData.currency?.toLowerCase() || 'aed'),
            product_data: {
              name: sessionData.title,
              description: sessionData.description,
              images: sessionData.image_url ? [sessionData.image_url] : [],
              metadata: {
                session_id: sessionId,
                category: sessionData.category || 'general',
              },
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      allowed_source_origins: process.env.NODE_ENV === 'production' 
        ? [process.env.NEXT_PUBLIC_APP_URL || 'https://subconsciousvalley.com']
        : undefined,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
      metadata: {
        sessionId: sessionId,
        sessionTitle: sessionData.title,
        userEmail: session.user.email,
        userName: session.user.name || '',
        environment: process.env.NODE_ENV || 'development',
      },
      payment_intent_data: {
        metadata: {
          sessionId: sessionId,
          userEmail: session.user.email,
        },
      },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['AE', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL'],
      },
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
      expiresAt: checkoutSession.expires_at,
    });

  } catch (error) {
    console.error('Stripe checkout error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    
    // Return appropriate error based on Stripe error type
    if (error.type === 'StripeCardError') {
      return NextResponse.json({ error: 'Payment method declined' }, { status: 402 });
    }
    
    if (error.type === 'StripeRateLimitError') {
      return NextResponse.json({ error: 'Too many requests, please try again later' }, { status: 429 });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ error: 'Invalid payment request' }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Payment processing unavailable' },
      { status: 500 }
    );
  }
}