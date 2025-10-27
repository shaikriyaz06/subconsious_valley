
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Session, Purchase, User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Headphones, Download, FileText, Lock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const languageNames = {
  english: "English",
  indian_english: "Indian English",
  hindi: "हिंदी",
  arabic: "العربية",
  tagalog: "Tagalog",
  chinese: "中文"
};

export default function SessionPlayer() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');

  const { t, currentLanguage: appLanguage } = useLanguage();

  useEffect(() => {
    const checkAccessAndLoad = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userData = await User.me();
        setUser(userData);

        const [sessionData, purchases] = await Promise.all([
          Session.get(sessionId),
          Purchase.filter({ user_email: userData.email, session_id: sessionId, payment_status: 'completed' })
        ]);
        
        setSession(sessionData);

        if (sessionData.price === 0 || purchases.length > 0) {
          setHasAccess(true);
          // Set initial language and audio
          const initialLang = sessionData.languages.includes(appLanguage) ? appLanguage : sessionData.languages[0] || 'english';
          setSelectedLanguage(initialLang);
          setCurrentAudioUrl(sessionData.audio_urls[initialLang] || sessionData.audio_files[initialLang] || '');
        } else {
          setHasAccess(false);
        }

      } catch (error) {
        console.error("Error loading session data:", error);
        if (error.message.includes('Unauthorized')) {
          await User.loginWithRedirect(window.location.href);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAccessAndLoad();
  }, [sessionId, appLanguage]);
  
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (session) {
      setCurrentAudioUrl(session.audio_urls[lang] || session.audio_files[lang] || '');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center text-center p-4">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">Session Not Found</h2>
            <p className="text-slate-600 mb-6">The session you are looking for does not exist.</p>
            <Link to={createPageUrl("Sessions")}>
              <Button>Browse Sessions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!hasAccess) {
     return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center text-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-slate-600 mb-6">You need to purchase this session to get access.</p>
            <Link to={createPageUrl(`checkout`) + `?session=${sessionId}`}>
              <Button>Purchase Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTranslated = (item, field) => {
    return item[`${field}_${appLanguage}`] || item[field];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-800">
                {getTranslated(session, 'title')}
              </CardTitle>
              <p className="text-slate-600 pt-2">{getTranslated(session, 'description')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Audio Player */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Headphones className="h-5 w-5 text-teal-600" />
                      Session Audio
                    </h3>
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {session.languages?.map(lang => (
                          <SelectItem key={lang} value={lang}>{languageNames[lang] || lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {currentAudioUrl ? (
                    <audio controls controlsList="nodownload" src={currentAudioUrl} className="w-full">
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5"/>
                        <p className="font-medium">Audio for '{languageNames[selectedLanguage]}' is not available.</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                    <p><strong>Pro Tip:</strong> For best results, listen in a quiet, comfortable space where you won't be disturbed. Use headphones for an immersive experience.</p>
                  </div>
                </div>

                {/* Downloadable Materials */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Download className="h-5 w-5 text-teal-600" />
                    Additional Materials
                  </h3>
                  
                  {session.how_to_use_pdf_url ? (
                    <a href={session.how_to_use_pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4"/> How to Use Guide (PDF)
                      </Button>
                    </a>
                  ) : null}

                  {session.worksheet_url ? (
                    <a href={session.worksheet_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4"/> Interactive Worksheet
                      </Button>
                    </a>
                  ) : null}

                  {session.feedback_form_url ? (
                    <a href={session.feedback_form_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4"/> Feedback Form
                      </Button>
                    </a>
                  ) : null}

                  {(!session.how_to_use_pdf_url && !session.worksheet_url && !session.feedback_form_url) && (
                    <p className="text-sm text-slate-500">No additional materials are available for this session.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
