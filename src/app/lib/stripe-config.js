// Production Stripe Configuration
export const stripeConfig = {
  // Environment check
  isProduction: process.env.NODE_ENV === 'production',
  
  // Domain configuration
  domain: process.env.NEXT_PUBLIC_APP_URL || 'https://subconsciousvalley.com',
  
  // Stripe keys (automatically switches based on environment)
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  
  // Webhook configuration
  webhookEvents: [
    'checkout.session.completed',
    'payment_intent.succeeded', 
    'payment_intent.payment_failed',
    'invoice.payment_succeeded',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
  ],
  
  // Payment configuration
  supportedCurrencies: ['AED', 'USD', 'EUR', 'GBP'],
  defaultCurrency: 'AED',
  
  // Checkout session configuration
  checkoutConfig: {
    paymentMethodTypes: ['card'],
    billingAddressCollection: 'auto',
    shippingAddressCollection: {
      allowedCountries: ['AE', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL']
    },
    sessionExpiration: 30 * 60, // 30 minutes
  },
  
  // URLs
  getSuccessUrl: (sessionId) => `${stripeConfig.domain}/checkout?session=${sessionId}&success=true`,
  getCancelUrl: (sessionId) => `${stripeConfig.domain}/checkout?session=${sessionId}&cancelled=true`,
  
  // Validation
  validateEnvironment() {
    const required = [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required Stripe environment variables: ${missing.join(', ')}`);
    }
    
    if (this.isProduction && !process.env.NEXT_PUBLIC_APP_URL) {
      console.warn('NEXT_PUBLIC_APP_URL not set for production environment');
    }
  }
};

// Validate on import
stripeConfig.validateEnvironment();