
import React, { useState, useEffect, useCallback } from "react";
import { User, Session, BlogPost, Subscription, Contact, Purchase } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  Play,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Calendar,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useCurrency } from "@/components/CurrencyConverter";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalBlogs: 0,
    totalSubscriptions: 0,
    totalContacts: 0,
    monthlyRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { formatPrice } = useCurrency();

  // Memoize loadDashboardData to ensure its reference is stable unless its dependencies change.
  const loadDashboardData = useCallback(async () => {
    try {
      const [sessions, blogs, subscriptions, contacts, purchases] = await Promise.all([
        Session.list('-created_date'),
        BlogPost.list('-created_date'),
        Subscription.filter({ status: 'active' }, '-created_date'), // Fetch only active subscriptions
        Contact.list('-created_date'),
        Purchase.list('-purchase_date', 5) // Fetch up to 5 most recent purchases
      ]);

      setRecentPurchases(purchases);

      // Calculate monthly revenue from purchases
      const currentMonth = new Date().getMonth();
      const monthlyRevenue = purchases
        .filter(p => new Date(p.purchase_date).getMonth() === currentMonth && p.payment_status === 'completed')
        .reduce((sum, p) => sum + (p.amount_paid || 0), 0);

      setStats({
        totalSessions: sessions.length,
        totalBlogs: blogs.length,
        totalSubscriptions: subscriptions.length, // This now correctly represents active subscriptions
        totalContacts: contacts.filter(c => c.status === 'new').length,
        monthlyRevenue
      });

      // Recent activity, showing top 2 of each type, then slicing to overall top 5
      const activity = [
        ...sessions.slice(0, 2).map(s => ({ type: 'session', item: s, icon: Play })),
        ...blogs.slice(0, 2).map(b => ({ type: 'blog', item: b, icon: FileText })),
        ...contacts.slice(0, 2).map(c => ({ type: 'contact', item: c, icon: MessageSquare }))
      ].sort((a, b) => new Date(b.item.created_date) - new Date(a.item.created_date)).slice(0, 5); // Overall top 5

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []); // Dependencies removed as setStats, setRecentActivity, setRecentPurchases are stable setters and icons are stable imports.

  // Memoize checkAdminAccess, depending on loadDashboardData and state setters.
  const checkAdminAccess = useCallback(async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(userData);
      await loadDashboardData();
    } catch (error) {
      console.error('Admin access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  }, [loadDashboardData]); // setUser and setIsLoading are stable setters, so they are removed from dependencies.

  // useEffect now depends on the memoized checkAdminAccess function.
  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]); // Only re-run if checkAdminAccess itself changes (which it won't unless its dependencies change)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const adminMenuItems = [
    {
      title: "Manage Sessions",
      description: "Add, edit, and organize hypnosis sessions",
      href: createPageUrl("AdminSessions"),
      icon: Play,
      color: "from-teal-500 to-emerald-600",
      count: stats.totalSessions
    },
    {
      title: "Manage Blog Posts",
      description: "Create and edit blog articles",
      href: createPageUrl("AdminBlogs"),
      icon: FileText,
      color: "from-purple-500 to-violet-600",
      count: stats.totalBlogs
    },
    {
      title: "View Purchases",
      description: "Monitor customer purchases and payments",
      href: createPageUrl("AdminPurchases"),
      icon: CreditCard,
      color: "from-emerald-500 to-teal-600",
      count: formatPrice(stats.monthlyRevenue) // Use formatted monthly revenue
    },
    {
      title: "Subscription Plans",
      description: "Manage pricing and subscription tiers",
      href: createPageUrl("AdminPlans"),
      icon: Users,
      color: "from-amber-500 to-orange-500",
      count: stats.totalSubscriptions
    },
    {
      title: "Payment Gateway",
      description: "Stripe integration and payment settings",
      href: createPageUrl("AdminPayments"),
      icon: DollarSign,
      color: "from-blue-500 to-indigo-600",
      count: "Stripe"
    },
    {
      title: "Contact Messages",
      description: "View and respond to user inquiries",
      href: createPageUrl("AdminContacts"),
      icon: MessageSquare,
      color: "from-violet-500 to-purple-600",
      count: stats.totalContacts
    },
    {
      title: "Site Settings",
      description: "General website configuration",
      href: createPageUrl("AdminSettings"),
      icon: Settings,
      color: "from-slate-500 to-slate-600",
      count: "Config"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-slate-600 text-lg">
                Welcome back, {user?.full_name}. Manage your Subconscious Valley platform.
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-2">
              Administrator
            </Badge>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Sessions", value: stats.totalSessions, icon: Play, color: "text-teal-600" },
            { label: "Total Purchases", value: recentPurchases.length, icon: Users, color: "text-emerald-600" },
            { label: "Monthly Revenue", value: formatPrice(stats.monthlyRevenue), icon: DollarSign, color: "text-amber-600" },
            { label: "New Messages", value: stats.totalContacts, icon: MessageSquare, color: "text-blue-600" }
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
                    <div className={`bg-slate-100 p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Admin Menu */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Management Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {adminMenuItems.map((item, index) => (
                      <Link key={item.title} to={item.href}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                              <item.icon className="h-5 w-5 text-white" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.count}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity & Purchases */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              {/* Recent Activity */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="bg-slate-100 p-2 rounded-full">
                          <activity.icon className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {activity.type === 'session' && activity.item.title}
                            {activity.type === 'blog' && activity.item.title}
                            {activity.type === 'contact' && `Message from ${activity.item.name}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(activity.item.created_date), 'MMM d, HH:mm')}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {activity.type}
                        </Badge>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Purchases */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Recent Purchases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPurchases.length > 0 ? recentPurchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center space-x-3">
                        <div className="bg-slate-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-slate-600" /> {/* Changed to Users icon for purchases */}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{purchase.user_name}</p>
                          <p className="text-xs text-slate-500 truncate">{purchase.session_title}</p>
                        </div>
                        <div className="font-semibold text-sm text-emerald-600">
                          {formatPrice(purchase.amount_paid)}
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500 text-center py-4">No recent purchases.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6"
            >
              <Card className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to={createPageUrl("AdminSessions") + "?action=new"}>
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Session
                      </Button>
                    </Link>
                    <Link to={createPageUrl("AdminBlogs") + "?action=new"}>
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Write Blog Post
                      </Button>
                    </Link>
                    <Link to={createPageUrl("AdminContacts")}>
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Check Messages
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
