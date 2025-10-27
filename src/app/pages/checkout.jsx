
import React, { useState, useEffect } from "react";
import { Session, Purchase, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Download, Check, Clock, ExternalLink, Facebook } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/CurrencyConverter";
import { createStripeCheckout } from "@/api/functions";
import { SiteSettings } from "@/api/entities"; // Import SiteSettings

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const paymentSuccess = searchParams.get('success') === 'true';
  const { formatPrice } = useCurrency();
  
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(paymentSuccess);
  const [siteSettings, setSiteSettings] = useState({}); // Add state for settings

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionData, userData, settingsData] = await Promise.all([
          Session.filter({id: sessionId}, '-created_date', 1),
          User.me().catch(() => null),
          SiteSettings.list()
        ]);

        if (sessionData.length > 0) {
          setSession(sessionData[0]);
        }
        
        if (!userData) {
          await User.loginWithRedirect(window.location.href);
          return;
        }
        
        setUser(userData);

        if(settingsData.length > 0) {
          setSiteSettings(settingsData[0]);
        }

        // Check if payment was successful
        if (paymentSuccess) {
          setPurchaseComplete(true);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, [sessionId, paymentSuccess]);

  const processPurchase = async () => {
    setIsProcessing(true);
    try {
      const successUrl = `${window.location.origin}${createPageUrl("checkout")}?session=${sessionId}&success=true`;
      const cancelUrl = `${window.location.origin}${createPageUrl("checkout")}?session=${sessionId}&cancelled=true`;

      const response = await createStripeCheckout({
        sessionId: sessionId,
        successUrl: successUrl,
        cancelUrl: cancelUrl
      });

      if (response.data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Error processing purchase. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Session Not Found</h2>
            <Link to={createPageUrl("Sessions")}>
              <Button>Browse Sessions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (purchaseComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-slate-800">Payment Successful!</h2>
                <p className="text-slate-600 mb-6">
                  Thank you for purchasing <strong>{session.title}</strong>. 
                  You now have access to all session materials including audio files, worksheets, and guides.
                </p>
                {/* Facebook CTA */}
                {siteSettings.facebook_group_url && (
                  <a 
                    href={siteSettings.facebook_group_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mb-6"
                  >
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
                      <h3 className="font-semibold text-blue-800 flex items-center justify-center gap-2">
                        <Facebook className="h-5 w-5" />
                        Join our Private Community
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">Connect with others and get exclusive content.</p>
                    </div>
                  </a>
                )}
                <div className="bg-teal-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-teal-800 mb-2">What's Included:</h3>
                  <ul className="text-sm text-teal-700 space-y-1 text-left">
                    <li>• Full hypnotherapy session audio</li>
                    {session.feedback_form_url && <li>• Progress tracking feedback form</li>}
                    {session.worksheet_url && <li>• Interactive worksheet</li>}
                    {session.how_to_use_pdf_url && <li>• How-to-use guide (PDF)</li>}
                    <li>• Lifetime access to all materials</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <Link to={createPageUrl("Dashboard")}>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white">
                      <Download className="mr-2 h-4 w-4" />
                      Access Your Materials
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Sessions")}>
                    <Button variant="outline" className="w-full">
                      Browse More Sessions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Sessions")}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sessions
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Secure Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Session Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {session.image_url && (
                    <img 
                      src={session.image_url} 
                      alt={session.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{session.title}</h3>
                    <p className="text-slate-600 mt-1">{session.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration || 25} minutes
                      </Badge>
                      <Badge variant="outline">{session.category?.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Full hypnotherapy session audio</span>
                  </div>
                  {session.feedback_form_url && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>Progress tracking feedback form</span>
                    </div>
                  )}
                  {session.worksheet_url && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>Interactive worksheet</span>
                    </div>
                  )}
                  {session.how_to_use_pdf_url && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>How-to-use guide (PDF)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Lifetime access to all materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Available in multiple languages</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle>Secure Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Session Price</span>
                    <span className="font-semibold">{formatPrice(session.price || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span className="font-semibold">{formatPrice(0)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(session.price || 0)}</span>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">S</div>
                      <span className="text-sm font-medium text-blue-800">Secured by Stripe</span>
                    </div>
                    <p className="text-xs text-blue-600">
                      Your payment information is encrypted and secure. 
                      We never store your card details.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={processPurchase}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Redirecting to Stripe...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Securely with Stripe
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    Secure checkout powered by Stripe. 
                    Instant access to all materials after payment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
