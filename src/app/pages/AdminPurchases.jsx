
import React, { useState, useEffect, useCallback } from "react";
import { Purchase, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Download, DollarSign, Calendar, User as UserIcon, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function AdminPurchases() {
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalRevenue: 0,
    completedPurchases: 0,
    averageOrderValue: 0
  });

  const loadPurchases = useCallback(async () => {
    try {
      const purchasesData = await Purchase.list('-purchase_date');
      setPurchases(purchasesData);
      
      // Calculate stats
      const totalPurchases = purchasesData.length;
      const completedPurchases = purchasesData.filter(p => p.payment_status === 'completed').length;
      const totalRevenue = purchasesData
        .filter(p => p.payment_status === 'completed')
        .reduce((sum, p) => sum + (p.amount_paid || 0), 0);
      const averageOrderValue = completedPurchases > 0 ? totalRevenue / completedPurchases : 0;

      setStats({
        totalPurchases,
        totalRevenue,
        completedPurchases,
        averageOrderValue
      });
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  }, []); // loadPurchases has no dependencies that would change over time

  const checkAdminAccess = useCallback(async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(userData);
      await loadPurchases();
    } catch (error) {
      console.error('Admin access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  }, [loadPurchases]); // checkAdminAccess depends on loadPurchases

  const filterPurchases = useCallback(() => {
    let filtered = purchases;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(purchase => 
        purchase.session_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(purchase => purchase.payment_status === statusFilter);
    }

    setFilteredPurchases(filtered);
  }, [purchases, searchTerm, statusFilter]); // filterPurchases depends on these state variables

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]); // useEffect depends on the memoized checkAdminAccess function

  useEffect(() => {
    filterPurchases();
  }, [filterPurchases]); // useEffect depends on the memoized filterPurchases function

  const exportPurchases = () => {
    const csvContent = [
      ['Date', 'Customer', 'Email', 'Session', 'Amount', 'Currency', 'Status'],
      ...filteredPurchases.map(purchase => [
        format(new Date(purchase.purchase_date), 'yyyy-MM-dd HH:mm'),
        purchase.user_name || 'N/A',
        purchase.user_email,
        purchase.session_title,
        purchase.amount_paid,
        purchase.currency || 'USD',
        purchase.payment_status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchases_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
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
              <h1 className="text-3xl font-bold text-slate-800">Purchase Management</h1>
              <p className="text-slate-600">View and manage all customer purchases</p>
            </div>
          </div>
          <Button onClick={exportPurchases} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Purchases",
              value: stats.totalPurchases,
              icon: FileText,
              color: "text-blue-600",
              bg: "bg-blue-100"
            },
            {
              label: "Completed Purchases",
              value: stats.completedPurchases,
              icon: UserIcon,
              color: "text-emerald-600",
              bg: "bg-emerald-100"
            },
            {
              label: "Total Revenue",
              value: `$${stats.totalRevenue.toFixed(2)}`,
              icon: DollarSign,
              color: "text-teal-600",
              bg: "bg-teal-100"
            },
            {
              label: "Avg. Order Value",
              value: `$${stats.averageOrderValue.toFixed(2)}`,
              icon: Calendar,
              color: "text-purple-600",
              bg: "bg-purple-100"
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

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by customer name, email, or session..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Purchases Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>
                Purchases ({filteredPurchases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPurchases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 font-medium text-slate-600">Date</th>
                        <th className="text-left py-3 font-medium text-slate-600">Customer</th>
                        <th className="text-left py-3 font-medium text-slate-600">Session</th>
                        <th className="text-left py-3 font-medium text-slate-600">Amount</th>
                        <th className="text-left py-3 font-medium text-slate-600">Status</th>
                        <th className="text-left py-3 font-medium text-slate-600">Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((purchase) => (
                        <tr key={purchase.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3">
                            {format(new Date(purchase.purchase_date), 'MMM d, yyyy')}
                            <div className="text-xs text-slate-500">
                              {format(new Date(purchase.purchase_date), 'HH:mm')}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">{purchase.user_name || 'N/A'}</div>
                            <div className="text-xs text-slate-500">{purchase.user_email}</div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">{purchase.session_title}</div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">
                              ${purchase.amount_paid?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {purchase.currency || 'USD'}
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge className={
                              purchase.payment_status === 'completed' 
                                ? 'bg-emerald-100 text-emerald-800'
                                : purchase.payment_status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : purchase.payment_status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-800'
                            }>
                              {purchase.payment_status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge variant={purchase.access_granted ? "default" : "outline"}>
                              {purchase.access_granted ? "Granted" : "Pending"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-500 mb-4">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No purchases found</p>
                    <p className="text-sm">
                      {searchTerm || statusFilter !== "all" 
                        ? "Try adjusting your filters" 
                        : "No purchases have been made yet"
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
