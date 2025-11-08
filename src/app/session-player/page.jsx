"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Headphones,
  Download,
  FileText,
  Lock,
  AlertTriangle,
} from "lucide-react";

const languageNames = {
  english: "English",
  hindi: "हिंदी",
  arabic: "العربية",
};

export default function SessionPlayer() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const { status } = useSession();

  const [sessionData, setSessionData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");

  useEffect(() => {
    const checkAccessAndLoad = async () => {
      if (!sessionId || status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        window.location.href = "/login";
        return;
      }

      try {
        // Check if sessionId is a parent or child session
        const sessionsRes = await fetch("/api/sessions");
        const sessions = await sessionsRes.json();
        
        let foundSession = null;
        let parentSession = null;
        
        // First check if it's a parent session
        foundSession = sessions.find(s => s._id === sessionId);
        
        if (!foundSession) {
          // Check if it's a child session ID
          for (const session of sessions) {
            if (session.child_sessions) {
              const childSession = session.child_sessions.find(child => child._id === sessionId);
              if (childSession) {
                foundSession = childSession;
                parentSession = session;
                break;
              }
            }
          }
        }
        
        if (!foundSession) {
          setIsLoading(false);
          return;
        }
        
        setSessionData(foundSession);

        // Check if user has purchased this session (check parent if it's a child)
        const purchasesRes = await fetch("/api/purchases");
        const purchases = await purchasesRes.json();
        
        const checkSessionId = parentSession ? parentSession._id : sessionId;
        const sessionPrice = parentSession ? parentSession.price : foundSession.price;
        
        const hasPurchased = purchases.some(
          (p) => p.session_id === checkSessionId && p.payment_status === "completed" && p.access_granted === true
        );

        if (sessionPrice === 0 || foundSession.is_sample || hasPurchased) {
          setHasAccess(true);
          setSelectedLanguage(foundSession.languages?.[0] || "english");
          
          // Get audio URL from child session or parent
          let audioUrl = "";
          if (foundSession.audio_urls) {
            audioUrl = foundSession.audio_urls.english || foundSession.audio_urls.hindi || foundSession.audio_urls.arabic || "";
          }
          
          if (audioUrl && audioUrl.includes("public/")) {
            audioUrl = audioUrl.split("public/")[1];
            audioUrl = "/" + audioUrl;
          }
          console.log("Audio URL:", audioUrl);
          setCurrentAudioUrl(audioUrl);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Error loading session data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccessAndLoad();
  }, [sessionId, status]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (sessionData && sessionData.audio_urls) {
      const audioUrl = sessionData.audio_urls[lang] || "";
      setCurrentAudioUrl(audioUrl);
    }
  };

  // Get available languages from audio_urls
  const getAvailableLanguages = () => {
    if (!sessionData?.audio_urls) return [];
    return Object.keys(sessionData.audio_urls).filter(lang => sessionData.audio_urls[lang]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center text-center p-4">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Session Not Found
            </h2>
            <p className="text-slate-600 mb-6">
              The session you are looking for does not exist.
            </p>
            <Link href="/sessions">
              <Button className="cursor-pointer">Browse Sessions</Button>
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
            <p className="text-slate-600 mb-6">
              You need to purchase this session to get access.
            </p>
            <Link href={`/checkout?session=${sessionId}`}>
              <Button className="cursor-pointer">Purchase Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-800">
                {sessionData.title}
              </CardTitle>
              <p className="text-slate-600 pt-2">{sessionData.description}</p>
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
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>Languages:</span>
                      {getAvailableLanguages().length > 1 ? (
                        <select
                          value={selectedLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="px-2 py-1 border rounded-md text-sm cursor-pointer"
                        >
                          {getAvailableLanguages().map((lang) => (
                            <option key={lang} value={lang}>
                              {languageNames[lang] || lang}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{languageNames[getAvailableLanguages()[0]] || "English"}</span>
                      )}
                    </div>
                  </div>

                  {/* <div className="mb-2 text-xs text-gray-500">
                    Debug: {currentAudioUrl || "No audio URL"}
                  </div> */}
                  {currentAudioUrl ? (
                    <audio
                      controls
                      controlsList="nodownload"
                      src={currentAudioUrl}
                      className="w-full"
                      preload="metadata"
                      crossOrigin="anonymous"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <p className="font-medium">
                          Audio for '{languageNames[selectedLanguage]}' is not
                          available.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                    <p>
                      <strong>Pro Tip:</strong> For best results, listen in a
                      quiet, comfortable space where you won't be disturbed. Use
                      headphones for an immersive experience.
                    </p>
                  </div>
                </div>

                {/* Downloadable Materials */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Download className="h-5 w-5 text-teal-600" />
                    Additional Materials
                  </h3>

                  {sessionData.materials && sessionData.materials.length > 0 ? (
                    <div className="space-y-2">
                      {sessionData.materials.map((material, index) => (
                        <a
                          key={index}
                          href={material.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2 cursor-pointer"
                          >
                            <FileText className="h-4 w-4 Upper"  /> {material.name.toUpperCase()}
                          </Button>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      No additional materials available
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
