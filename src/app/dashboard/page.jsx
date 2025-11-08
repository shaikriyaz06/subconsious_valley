"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SessionChecker from '@/components/SessionChecker'
import Link from "next/link";
import {
  Play,
  Settings,
  LogOut,
  Headphones,
  FileText,
  Download,
  Facebook,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [expandedSessions, setExpandedSessions] = useState({});
  const isLoading = status === "loading";

  const toggleExpanded = (purchaseId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [purchaseId]: !prev[purchaseId]
    }));
  };

  const loadDashboardData = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      // Fetch user purchases
      const purchasesResponse = await fetch('/api/purchases');
      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json();
        setPurchases(purchasesData);
      }

      setSiteSettings({
        facebook_group_url: "https://facebook.com/groups/subconsciousvalley",
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (session) {
      loadDashboardData();
    }
  }, [session, status, router, loadDashboardData]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
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
      <SessionChecker />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Welcome, {session?.user?.name}
            </h1>
            <p className="text-slate-600">
              This is your personal space for transformation.
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="cursor-pointer"
          >
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
                    <h3 className="font-bold text-lg">
                      Join Our Private Community
                    </h3>
                    <p className="text-sm opacity-90">
                      Connect with others on the same journey in our exclusive
                      Facebook group.
                    </p>
                  </div>
                </div>
                <a
                  href={siteSettings.facebook_group_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    className="bg-white/90 text-blue-600 hover:bg-white"
                  >
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
                    <div key={purchase._id} className="space-y-4">
                      <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-teal-50/50 transition-colors">
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {purchase.session_title}
                          </h4>
                          <p className="text-sm text-slate-500">
                            Purchased on:{" "}
                            {new Date(purchase.purchase_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-slate-400">
                            Amount: {purchase.currency} {purchase.amount_paid.toFixed(2)}
                          </p>
                        </div>
                        {purchase.session?.child_sessions && purchase.session.child_sessions.length > 0 ? (
                          <Button 
                            onClick={() => toggleExpanded(purchase._id)}
                            variant="outline"
                            className="cursor-pointer"
                          >
                            {expandedSessions[purchase._id] ? (
                              <ChevronDown className="h-4 w-4 mr-2" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-2" />
                            )}
                            {purchase.session.child_sessions.length} Sessions
                          </Button>
                        ) : (
                          <Link href={`/session-player?session=${purchase.session_id}`}>
                            <Button className="cursor-pointer">
                              <Play className="h-4 w-4 mr-2" />
                              Start Session
                            </Button>
                          </Link>
                        )}
                      </div>
                      
                      {/* Child Sessions - Collapsible */}
                      {purchase.session?.child_sessions && purchase.session.child_sessions.length > 0 && expandedSessions[purchase._id] && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 space-y-2"
                        >
                          <h5 className="text-sm font-medium text-slate-600">Individual Sessions:</h5>
                          {purchase.session.child_sessions.map((childSession, index) => (
                            <div key={index} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-slate-700">{childSession.title}</p>
                                <p className="text-xs text-slate-500">{childSession.duration || 25} minutes</p>
                              </div>
                              <Link href={`/session-player?session=${childSession._id}`}>
                                <Button size="sm" variant="outline" className="cursor-pointer">
                                  <Play className="h-3 w-3 mr-1" />
                                  Start Session
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">
                    You haven't purchased any sessions yet.
                  </p>
                  <Link href="/sessions">
                    <Button className="cursor-pointer">Explore Sessions</Button>
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
