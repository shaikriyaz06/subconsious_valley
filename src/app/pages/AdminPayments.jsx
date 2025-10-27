
import React, { useState, useEffect } from "react";
import { Subscription, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, TrendingUp, ArrowLeft, Settings, Zap, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function AdminPayments() {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    conversionRate: 0
  });
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
    testMode: true
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadPaymentData = async () => {
    try {
      const subscriptionsData = await Subscription.list('-created_date');
      setSubscriptions(subscriptionsData);

      // Calculate stats
      const totalRevenue = subscriptionsData.reduce((sum, sub) => sum + (sub.amount || 0), 0);
      const currentMonth = new Date().getMonth();
      const monthlyRevenue = subscriptionsData
        .filter(sub => new Date(sub.created_date).getMonth() === currentMonth)
        .reduce((sum, sub) => sum + (sub.amount || 0), 0);
      const activeSubscriptions = subscriptionsData.filter(sub => sub.status === 'active').length;

      setPaymentStats({
        totalRevenue,
        monthlyRevenue,
        activeSubscriptions,
        conversionRate: activeSubscriptions > 0 ? Math.round((activeSubscriptions / subscriptionsData.length) * 100) : 0
      });
    } catch (error) {
      console.error('Error loading payment data:', error);
    }
  };

  const checkAdminAccess = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(userData);
      await loadPaymentData();
    } catch (error) {
      console.error('Admin access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAdminAccess();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStripeConfigSave = () => {
    // In a real implementation, this would save to a secure backend
    alert('Stripe configuration saved! (This is a demo - integrate with your backend)');
  };

  const generateStripeCheckoutCode = () => {
    return `
// Stripe Payment Integration Example
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('${stripeConfig.publishableKey}');

export const createCheckoutSession = async (priceId, customerId) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: priceId,
      customer_id: customerId,
      success_url: window.location.origin + '/success',
      cancel_url: window.location.origin + '/cancel',
    }),
  });

  const session = await response.json();
  
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({
    sessionId: session.id,
  });
};
`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminDashboard")}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Payment Gateway</h1>
              <p className="text-slate-600">Manage Stripe integration and view payment analytics</p>
            </div>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: "Total Revenue", 
              value: `$${paymentStats.totalRevenue.toFixed(2)}`, 
              icon: DollarSign, 
              color: "text-emerald-600",
              bg: "bg-emerald-100"
            },
            { 
              label: "Monthly Revenue", 
              value: `$${paymentStats.monthlyRevenue.toFixed(2)}`, 
              icon: TrendingUp, 
              color: "text-teal-600",
              bg: "bg-teal-100"
            },
            { 
              label: "Active Subscriptions", 
              value: paymentStats.activeSubscriptions, 
              icon: CreditCard, 
              color: "text-blue-600",
              bg: "bg-blue-100"
            },
            { 
              label: "Conversion Rate", 
              value: `${paymentStats.conversionRate}%`, 
              icon: Zap, 
              color: "text-amber-600",
              bg: "bg-amber-100"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                    <div className={`${stat.bg} p-3 rounded-full`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stripe Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Stripe Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <p className="text-sm font-medium text-amber-800">Important Security Note</p>
                  </div>
                  <p className="text-sm text-amber-700">
                    Never store API keys in frontend code. This demo shows the interface - 
                    implement secure backend API key storage.
                  </p>
                </div>

                <div>
                  <Label htmlFor="publishable_key">Publishable Key</Label>
                  <Input
                    id="publishable_key"
                    value={stripeConfig.publishableKey}
                    onChange={(e) => setStripeConfig({...stripeConfig, publishableKey: e.target.value})}
                    placeholder="pk_test_..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="secret_key">Secret Key (Backend Only)</Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={stripeConfig.secretKey}
                    onChange={(e) => setStripeConfig({...stripeConfig, secretKey: e.target.value})}
                    placeholder="sk_test_..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="webhook_secret">Webhook Secret</Label>
                  <Input
                    id="webhook_secret"
                    type="password"
                    value={stripeConfig.webhookSecret}
                    onChange={(e) => setStripeConfig({...stripeConfig, webhookSecret: e.target.value})}
                    placeholder="whsec_..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="test_mode">Environment</Label>
                  <Select 
                    value={stripeConfig.testMode ? "test" : "live"}
                    onValueChange={(value) => setStripeConfig({...stripeConfig, testMode: value === "test"})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test Mode</SelectItem>
                      <SelectItem value="live">Live Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleStripeConfigSave}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Integration Code */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Integration Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{generateStripeCheckoutCode()}</code>
                  </pre>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-slate-800 mb-2">Backend Implementation Required:</p>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Create checkout session endpoint</li>
                      <li>• Handle webhook events</li>
                      <li>• Update subscription status</li>
                      <li>• Manage customer data</li>
                    </ul>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(generateStripeCheckoutCode())}
                  >
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 font-medium text-slate-600">Customer</th>
                        <th className="text-left py-3 font-medium text-slate-600">Plan</th>
                        <th className="text-left py-3 font-medium text-slate-600">Amount</th>
                        <th className="text-left py-3 font-medium text-slate-600">Status</th>
                        <th className="text-left py-3 font-medium text-slate-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.slice(0, 10).map((subscription) => (
                        <tr key={subscription.id} className="border-b border-slate-100">
                          <td className="py-3">{subscription.created_by}</td>
                          <td className="py-3">
                            <Badge className="bg-teal-100 text-teal-800 capitalize">
                              {subscription.plan_name}
                            </Badge>
                          </td>
                          <td className="py-3">${subscription.amount?.toFixed(2) || '0.00'}</td>
                          <td className="py-3">
                            <Badge className={
                              subscription.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800'
                                : subscription.status === 'cancelled'
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-amber-100 text-amber-800'
                            }>
                              {subscription.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-slate-500">
                            {format(new Date(subscription.created_date), 'MMM d, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No subscriptions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
