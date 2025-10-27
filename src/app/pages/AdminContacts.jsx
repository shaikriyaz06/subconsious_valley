
import React, { useState, useEffect } from "react";
import { Contact, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Mail, ArrowLeft, Check, Clock, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function AdminContacts() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadContacts = async () => {
    try {
      const contactsData = await Contact.list('-created_date');
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading contacts:', error);
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
      await loadContacts();
    } catch (error) {
      console.error('Admin access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  };

  const filterContacts = () => {
    let filtered = contacts;
    if (statusFilter !== "all") {
      filtered = contacts.filter(contact => contact.status === statusFilter);
    }
    setFilteredContacts(filtered);
  };

  useEffect(() => {
    checkAdminAccess();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterContacts();
  }, [contacts, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      await Contact.update(contactId, { ...contact, status: newStatus });
      await loadContacts();
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Error updating contact status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-amber-100 text-amber-800';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />;
      case 'contacted':
        return <Mail className="h-4 w-4" />;
      case 'resolved':
        return <Check className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const statusStats = {
    new: contacts.filter(c => c.status === 'new').length,
    contacted: contacts.filter(c => c.status === 'contacted').length,
    resolved: contacts.filter(c => c.status === 'resolved').length,
    total: contacts.length
  };

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
              <h1 className="text-3xl font-bold text-slate-800">Contact Messages</h1>
              <p className="text-slate-600">View and respond to user inquiries</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Messages", value: statusStats.total, color: "text-slate-600", bg: "bg-slate-100" },
            { label: "New Messages", value: statusStats.new, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "In Progress", value: statusStats.contacted, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "Resolved", value: statusStats.resolved, color: "text-emerald-600", bg: "bg-emerald-100" }
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
                      <MessageSquare className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Messages */}
        <div className="space-y-6">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-100 p-2 rounded-full">
                          <UserIcon className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <p className="text-sm text-slate-500">
                            {format(new Date(contact.created_date), 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(contact.status)}>
                          {getStatusIcon(contact.status)}
                          <span className="ml-1 capitalize">{contact.status}</span>
                        </Badge>
                        <Select
                          value={contact.status}
                          onValueChange={(newStatus) => updateContactStatus(contact.id, newStatus)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-slate-800 mb-2">{contact.subject}</h4>
                        <p className="text-slate-700 mb-4 leading-relaxed whitespace-pre-wrap">
                          {contact.message}
                        </p>
                        {contact.preferred_language && (
                          <Badge variant="outline" className="text-xs">
                            Preferred: {contact.preferred_language}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4" />
                          <a 
                            href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                            className="text-teal-600 hover:text-teal-700"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <div className="pt-4">
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                            onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}&body=Hi ${contact.name},%0D%0A%0D%0AThank you for reaching out to Subconscious Valley.`)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Reply via Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-xl text-slate-600 mb-2">
                {statusFilter === 'all' ? 'No messages found' : `No ${statusFilter} messages`}
              </p>
              <p className="text-slate-500">
                Contact messages will appear here when users submit the contact form.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
