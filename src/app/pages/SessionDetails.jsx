
import React, { useState, useEffect, useCallback } from "react";
import { Session, SessionBooking, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Clock, Star, Calendar, ArrowLeft, User as UserIcon, Globe } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const languageNames = {
  english: "English",
  indian_english: "Indian English",
  hindi: "हिंदी",
  arabic: "العربية", 
  tagalog: "Tagalog",
  chinese: "中文"
};

export default function SessionDetails() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  
  const [session, setSession] = useState(null);
  const [subSessions, setSubSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSubSession, setSelectedSubSession] = useState(null);
  const [bookingData, setBookingData] = useState({
    scheduled_date: "",
    language_preference: "english",
    notes: ""
  });

  const loadSessionData = useCallback(async () => {
    try {
      const [sessionData, userData] = await Promise.all([
        Session.filter({id: sessionId}, '-created_date', 1),
        User.me().catch(() => null)
      ]);

      if (sessionData.length > 0) {
        const mainSession = sessionData[0];
        setSession(mainSession);
        
        // Load sub-sessions if this is a parent session
        const subSessionsData = await Session.filter({parent_session_id: sessionId}, 'session_order');
        setSubSessions(subSessionsData);
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Error loading session:', error);
    }
    setIsLoading(false);
  }, [sessionId]); // Dependency array for useCallback

  useEffect(() => {
    if (sessionId) {
      loadSessionData();
    }
  }, [sessionId, loadSessionData]); // Added loadSessionData to dependency array

  const handleBooking = async (sessionToBook) => {
    if (!user) {
      await User.loginWithRedirect(window.location.href);
      return;
    }

    setSelectedSubSession(sessionToBook);
    setShowBookingForm(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingSession = selectedSubSession || session;
      const booking = {
        session_id: bookingSession.id,
        session_title: bookingSession.title,
        user_email: user.email,
        user_name: user.full_name,
        booking_date: new Date().toISOString(),
        scheduled_date: new Date(bookingData.scheduled_date).toISOString(),
        language_preference: bookingData.language_preference,
        notes: bookingData.notes,
        amount_paid: bookingSession.price || 0,
        status: "pending"
      };

      await SessionBooking.create(booking);
      alert('Booking submitted successfully! We will confirm your appointment soon.');
      setShowBookingForm(false);
      setSelectedSubSession(null);
      setBookingData({
        scheduled_date: "",
        language_preference: "english",
        notes: ""
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error submitting booking. Please try again.');
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Session Not Found</h1>
          <Link to={createPageUrl("Sessions")}>
            <Button>Back to Sessions</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={createPageUrl("Sessions")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </Link>

        {/* Session Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-800">
                    {session.title}
                  </h1>
                  <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                    {session.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge className="bg-teal-100 text-teal-800 px-3 py-1">
                      {session.category?.replace('_', ' ')}
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
                      ${session.price || 0}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {session.duration} min
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-slate-500" />
                      <span className="text-slate-700">Available in:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {session.languages?.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {languageNames[lang]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {session.booking_enabled && !subSessions.length && (
                    <Button
                      onClick={() => handleBooking(session)}
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                      size="lg"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Book This Session
                    </Button>
                  )}
                </div>

                {session.image_url && (
                  <div className="aspect-video bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl overflow-hidden">
                    <img 
                      src={session.image_url} 
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sub-sessions */}
        {subSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800">
                  Session Components ({subSessions.length} Sessions)
                </CardTitle>
                <p className="text-slate-600">
                  This program consists of multiple sessions. You can book individual sessions or the complete package.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subSessions.map((subSession, index) => (
                    <motion.div
                      key={subSession.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="h-full border border-slate-200 hover:border-teal-300 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <Badge className="bg-teal-100 text-teal-800">
                              Session {subSession.session_order}
                            </Badge>
                            <Badge className="bg-amber-100 text-amber-800">
                              ${subSession.price || 0}
                            </Badge>
                          </div>
                          
                          <h3 className="font-bold text-slate-800 mb-3 leading-tight">
                            {subSession.title}
                          </h3>
                          
                          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                            {subSession.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                            <Clock className="h-4 w-4" />
                            {subSession.duration} minutes
                          </div>

                          {subSession.booking_enabled && (
                            <Button
                              onClick={() => handleBooking(subSession)}
                              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              Book Session {subSession.session_order}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowBookingForm(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Book Session
                </h3>
                <p className="text-slate-600 mb-6">
                  {selectedSubSession?.title || session.title}
                </p>
                
                <form onSubmit={submitBooking} className="space-y-4">
                  <div>
                    <Label htmlFor="scheduled_date">Preferred Date & Time</Label>
                    <Input
                      id="scheduled_date"
                      type="datetime-local"
                      value={bookingData.scheduled_date}
                      onChange={(e) => setBookingData({...bookingData, scheduled_date: e.target.value})}
                      required
                      className="mt-1"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="language_preference">Preferred Language</Label>
                    <Select
                      value={bookingData.language_preference}
                      onValueChange={(value) => setBookingData({...bookingData, language_preference: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {session.languages?.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {languageNames[lang]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      placeholder="Any specific requests or questions?"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Booking Summary</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p><strong>Session:</strong> {selectedSubSession?.title || session.title}</p>
                      <p><strong>Duration:</strong> {selectedSubSession?.duration || session.duration} minutes</p>
                      <p><strong>Price:</strong> ${selectedSubSession?.price || session.price || 0}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                    >
                      Submit Booking Request
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBookingForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
