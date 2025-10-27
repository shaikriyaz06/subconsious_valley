import React, { useState, useEffect, useCallback } from "react";
import { User, Purchase, SiteSettings } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Play, 
  Settings, 
  LogOut, 
  Headphones, 
  FileText, 
  Download,
  Facebook
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState({});

  const loadDashboardData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const [purchasesData, settingsData] = await Promise.all([
        Purchase.filter({ user_email: userData.email, payment_status: 'completed' }, '-purchase_date'),
        SiteSettings.list()
      ]);

      setPurchases(purchasesData);
      if (settingsData.length > 0) {
        setSiteSettings(settingsData[0]);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // If user is not authenticated, redirect to login
      if (error.message.includes('Unauthorized')) {
        await User.loginWithRedirect(window.location.href);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleLogout = async () => {
    await User.logout();
    window.location.href = createPageUrl("Home");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.full_name}</h1>
            <p className="text-slate-600">This is your personal space for transformation.</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Facebook Group CTA */}
        {siteSettings.facebook_group_url && purchases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Facebook className="h-8 w-8" />
                  <div>
                    <h3 className="font-bold text-lg">Join Our Private Community</h3>
                    <p className="text-sm opacity-90">Connect with others on the same journey in our exclusive Facebook group.</p>
                  </div>
                </div>
                <a href={siteSettings.facebook_group_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="bg-white/90 text-blue-600 hover:bg-white">
                    Join Now
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* My Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-teal-600" />
                My Purchased Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {purchases.length > 0 ? (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-teal-50/50 transition-colors">
                      <div>
                        <h4 className="font-semibold text-slate-800">{purchase.session_title}</h4>
                        <p className="text-sm text-slate-500">
                          Purchased on: {new Date(purchase.purchase_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to={createPageUrl(`SessionPlayer`) + `?session=${purchase.session_id}`}>
                        <Button>
                          <Play className="h-4 w-4 mr-2" />
                          Start Session
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">You haven't purchased any sessions yet.</p>
                  <Link to={createPageUrl("Sessions")}>
                    <Button>Explore Sessions</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}