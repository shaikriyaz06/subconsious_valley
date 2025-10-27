import React, { useState, useEffect, useCallback } from "react";
import { User, Session, BlogPost, Subscription, Contact, Purchase } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/CurrencyConverter";

export default function TeamDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalBlogs: 0,
    totalSubscriptions: 0,
    totalContacts: 0,
    monthlyRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { formatPrice } = useCurrency();

  const loadDashboardData = useCallback(async () => {
    try {
      const [sessions, blogs, subscriptions, contacts, purchases] = await Promise.all([
        Session.list('-created_date'),
        BlogPost.list('-created_date'),
        Subscription.filter({ status: 'active' }, '-created_date'),
        Contact.list('-created_date'),
        Purchase.list('-purchase_date', 5)
      ]);

      const currentMonth = new Date().getMonth();
      const monthlyRevenue = purchases
        .filter(p => new Date(p.purchase_date).getMonth() === currentMonth && p.payment_status === 'completed')
        .reduce((sum, p) => sum + (p.amount_paid || 0), 0);

      setStats({
        totalSessions: sessions.length,
        totalBlogs: blogs.length,
        totalSubscriptions: subscriptions.length,
        totalContacts: contacts.filter(c => c.status === 'new').length,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  const checkTeamAccess = useCallback(async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin' && userData.role !== 'team_member') {
        alert('Access denied. Team member privileges required.');
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(userData);
      await loadDashboardData();
    } catch (error) {
      console.error('Team access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  }, [loadDashboardData]);

  useEffect(() => {
    checkTeamAccess();
  }, [checkTeamAccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const teamMenuItems = [
    {
      title: "Manage Sessions",
      description: "Add, edit, and organize hypnosis sessions",
      href: createPageUrl("TeamSessions"),
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
      description: "Monitor customer purchases",
      href: createPageUrl("AdminPurchases"),
      icon: CreditCard,
      color: "from-emerald-500 to-teal-600",
      count: formatPrice(stats.monthlyRevenue)
    },
    {
      title: "Contact Messages",
      description: "View and respond to user inquiries",
      href: createPageUrl("AdminContacts"),
      icon: MessageSquare,
      color: "from-violet-500 to-purple-600",
      count: stats.totalContacts
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Team Dashboard
                </span>
              </h1>
              <p className="text-slate-600 text-lg">
                Welcome back, {user?.full_name}. Manage your assigned tasks.
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2">
              Team Member
            </Badge>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Sessions", value: stats.totalSessions, icon: Play, color: "text-teal-600" },
            { label: "Total Blogs", value: stats.totalBlogs, icon: FileText, color: "text-purple-600" },
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Management Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {teamMenuItems.map((item, index) => (
                  <Link key={item.title} to={item.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.count}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
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
    </div>
  );
}