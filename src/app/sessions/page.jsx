"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Session, User, Purchase } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Lock, Star, Clock, Globe, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useCurrency } from "@/components/CurrencyConverter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useApiCache } from "@/hooks/useApiCache";

// Dynamic category names will be generated from sessions

// Memoize language names to prevent recreation
const languageNames = {
  english: "English",
  indian_english: "Indian English",
  hindi: "हिंदी",
  arabic: "العربية",
  tagalog: "Tagalog",
  chinese: "中文",
};

// Helper function to create page URLs
const createPageUrl = (pageName) => {
  switch (pageName) {
    case "checkout":
      return "/checkout";
    case "SessionPlayer":
      return "/session-player";
    // Add more cases for other page names if needed
    default:
      return `/${pageName.toLowerCase()}`;
  }
};

export default function Sessions() {
  const { t, currentLanguage } = useLanguage();
  const { formatPrice } = useCurrency();
  const { data: session } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState({});

  // Use API cache for sessions
  const { data: sessionsData, loading: sessionsLoading } = useApiCache('/api/sessions');
  
  useEffect(() => {
    if (sessionsData) {
      setSessions(sessionsData);
      
      // Generate dynamic categories from parent session titles only
      const categories = {};
      sessionsData.forEach((session) => {
        if (session.title && session.parent_id === null) {
          categories[session.title] = session.title;
        }
      });
      setDynamicCategories(categories);
    }
  }, [sessionsData]);

  useEffect(() => {
    // Always fetch fresh purchases if user is logged in (user-specific data)
    const loadPurchases = async () => {
      if (session?.user) {
        try {
          const purchasesResponse = await fetch("/api/purchases");
          if (purchasesResponse.ok) {
            const purchasesData = await purchasesResponse.json();
            setPurchases(purchasesData);
          }
        } catch (purchaseError) {
          console.error("Error loading purchases:", purchaseError);
        }
      }
      setIsLoading(false);
    };
    
    if (!sessionsLoading) {
      loadPurchases();
    }
  }, [session?.user, sessionsLoading]);

  // Check access based on session price and user purchases
  const hasAccess = useCallback((sessionItem) => {
    // Free sessions are always accessible
    if (sessionItem.price === 0 || sessionItem.isFree) {
      return true;
    }
    
    // If user is not logged in, no access to paid sessions
    if (!session?.user) {
      return false;
    }
    
    // Check if user has purchased this session
    return purchases.some(
      (purchase) =>
        purchase.session_id === sessionItem._id &&
        purchase.payment_status === "completed"
    );
  }, [session?.user, purchases]);

  const handleSessionAction = useCallback((session) => {
    if (hasAccess(session)) {
      // Check if this is a parent session with child sessions
      if (session.child_sessions && session.child_sessions.length > 0) {
        // Redirect to dashboard to see individual sessions
        router.push("/dashboard");
      } else {
        // Single session - go to player
        router.push(`/session-player?session=${session._id}`);
      }
    } else {
      // User needs to purchase
      router.push(`/checkout?session=${session._id}`);
    }
  }, [hasAccess, router]);

  // Memoize filtered sessions to prevent recalculation on every render
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Only show parent sessions
      const isParent = session.parent_id === null;
      const categoryMatch =
        selectedCategory === "all" ||
        session.title === selectedCategory;
      const languageMatch =
        selectedLanguage === "all" ||
        session.languages?.includes(selectedLanguage);
      return isParent && categoryMatch && languageMatch;
    });
  }, [sessions, selectedCategory, selectedLanguage]);

  const selectCategory = useCallback((category) => {
    setSelectedCategory(category === selectedCategory ? "all" : category);
  }, [selectedCategory]);

  const getTranslated = useCallback((item, field) => {
    return item[`${field}_${currentLanguage}`] || item[field];
  }, [currentLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {t("sessions_title")}
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t("sessions_desc")}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <div className="w-full">
            {/* <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">{t("categories")}</span>
            </div> */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <Filter className="h-5 w-5 mt-1 text-slate-500" />
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                All Categories
              </button>
              {Object.entries(dynamicCategories).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => selectCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === key
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
                  }`}
                >
                  {name}
                  {selectedCategory === key && (
                    <X className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-slate-500" />
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("all_languages")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all_languages")}</SelectItem>
                {Object.entries(languageNames).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
        </motion.div>

        {/* Sessions Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-2xl h-80"></div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session._id || session.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index < 6 ? index * 0.1 : 0 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 group">
                  <CardHeader className="relative overflow-hidden rounded-t-2xl">
                    <div className="aspect-video bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl relative overflow-hidden">
                      {session.image_url ? (
                        <img
                          src={session.image_url}
                          alt={session.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-12 w-12 text-teal-600 opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-white/90 text-slate-700">
                          {session.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        {!hasAccess(session) && (
                          <div className="bg-amber-500 text-white p-2 rounded-full">
                            <Lock className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold mt-4 text-slate-800 group-hover:text-teal-600 transition-colors">
                      {getTranslated(session, "title")}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="text-slate-600 mb-4 leading-relaxed h-20 overflow-hidden">
                      {getTranslated(session, "description") ||
                        "Transform your mindset and unlock your potential with this powerful hypnotherapy session."}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.duration || 25} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-amber-400" />
                        4.9
                      </div>
                    </div>

                    {/* Available Languages */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        {t("available_in")}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {session.languages?.slice(0, 3).map((lang) => (
                          <Badge
                            key={lang}
                            variant="outline"
                            className="text-xs"
                          >
                            {languageNames[lang]}
                          </Badge>
                        ))}
                        {session.languages?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{session.languages.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSessionAction(session)}
                      className="cursor-pointer w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {hasAccess(session)
                        ? session.child_sessions &&
                          session.child_sessions.length > 0
                          ? t("view_collection")
                          : t("start_session")
                        : session.price > 0
                        ? `${t("purchase")} - ${formatPrice(session.price)}`
                        : t("start_session")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredSessions.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-xl text-slate-600">{t("no_sessions_found")}</p>
            <Button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedLanguage("all");
              }}
              variant="outline"
              className="mt-4"
            >
              {t("clear_filters")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
