"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Lock, Star, ArrowLeft, ChevronRight, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useCurrency } from "@/components/CurrencyConverter";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Collection() {
  const { t, currentLanguage } = useLanguage();
  const { formatPrice } = useCurrency();
  const { data: authSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  
  const [parentSession, setParentSession] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChildren, setExpandedChildren] = useState({});
  const [selectedChild, setSelectedChild] = useState("all");

  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) {
        router.push("/sessions");
        return;
      }

      try {
        const sessionResponse = await fetch(`/api/sessions/${sessionId}`);
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          setParentSession(sessionData);
        }

        if (authSession?.user) {
          const purchasesResponse = await fetch("/api/purchases");
          if (purchasesResponse.ok) {
            const purchasesData = await purchasesResponse.json();
            setPurchases(purchasesData);
          }
        }
      } catch (error) {
        console.error("Error loading session data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId, authSession?.user, router]);

  const hasAccess = useCallback((sessionItem) => {
    if (sessionItem.price === 0 || sessionItem.isFree) {
      return true;
    }
    
    if (!authSession?.user) {
      return false;
    }
    
    return purchases.some(
      (purchase) =>
        purchase.session_id === parentSession?._id &&
        purchase.payment_status === "completed"
    );
  }, [authSession?.user, purchases, parentSession]);

  const toggleChildExpansion = useCallback((childId) => {
    console.log('Toggling expansion for:', childId);
    console.log('Current expanded state:', expandedChildren);
    setExpandedChildren(prev => {
      const newState = {
        ...prev,
        [childId]: !prev[childId]
      };
      console.log('New expanded state:', newState);
      return newState;
    });
  }, [expandedChildren]);

  const handleChildAction = useCallback((child, event, index) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    if (hasAccess(parentSession)) {
      if (child.sub_sessions && child.sub_sessions.length > 0) {
        const childKey = child._id || `child-${index}`;
        toggleChildExpansion(childKey);
      } else {
        router.push(`/session-player?session=${parentSession._id}&child=${child._id}`);
      }
    } else {
      router.push(`/checkout?session=${parentSession._id}`);
    }
  }, [hasAccess, parentSession, router, toggleChildExpansion]);

  const handleSubSessionAction = useCallback((child, subSession) => {
    if (hasAccess(parentSession)) {
      router.push(`/session-player?session=${parentSession._id}&child=${child._id}&sub=${subSession._id}`);
    } else {
      router.push(`/checkout?session=${parentSession._id}`);
    }
  }, [hasAccess, parentSession, router]);

  const filteredChildSessions = useMemo(() => {
    if (!parentSession?.child_sessions) return [];
    
    return parentSession.child_sessions.filter((child) => {
      return selectedChild === "all" || child.title === selectedChild;
    });
  }, [parentSession, selectedChild]);

  const selectChild = useCallback((childTitle) => {
    setSelectedChild(childTitle === selectedChild ? "all" : childTitle);
  }, [selectedChild]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!parentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Session not found</h1>
          <Button onClick={() => router.push("/sessions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Button 
            onClick={() => router.push("/sessions")}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {parentSession.title}
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            {parentSession.description}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Filter className="h-5 w-5 mt-1 text-slate-500" />
            <button
              onClick={() => setSelectedChild("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedChild === "all"
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              All Programs
            </button>
            {parentSession?.child_sessions?.map((child) => (
              <button
                key={child.title}
                onClick={() => selectChild(child.title)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedChild === child.title
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                {child.title}
                {selectedChild === child.title && (
                  <X className="h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChildSessions.map((child, index) => (
            <motion.div
              key={child._id || `child-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 group">
                <CardHeader className="relative overflow-hidden rounded-t-2xl">
                  <div className="aspect-video bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl relative overflow-hidden">
                    {child.image_url ? (
                      <img
                        src={child.image_url}
                        alt={child.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="h-12 w-12 text-teal-600 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                    <div className="absolute top-3 right-3">
                      {!hasAccess(parentSession) && (
                        <div className="bg-amber-500 text-white p-2 rounded-full">
                          <Lock className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mt-4 text-slate-800 group-hover:text-teal-600 transition-colors">
                    {child.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4 leading-relaxed h-16 overflow-hidden">
                    {child.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      {(() => {
                        const seed = (child.title?.length || 10) + index * 7;
                        const rating = (4.6 + (seed % 40) / 100).toFixed(1);
                        const fullStars = Math.floor(rating);
                        const partialStar = rating - fullStars;
                        
                        return (
                          <>
                            {[...Array(fullStars)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                            ))}
                            {partialStar > 0 && (
                              <div className="relative">
                                <Star className="h-4 w-4 text-amber-400" />
                                <div className="absolute inset-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
                                  <Star className="h-4 w-4 fill-current text-amber-400" />
                                </div>
                              </div>
                            )}
                            <span className="ml-1 text-sm">{rating}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {child.sub_sessions && child.sub_sessions.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-teal-600">
                        {child.sub_sessions.length} sessions included
                      </div>
                    </div>
                  )}

                  {child.sub_sessions && child.sub_sessions.length > 0 && expandedChildren[child._id || `child-${index}`] && (
                    <div className="mb-4 space-y-2 p-3 bg-teal-50 rounded-lg">
                      <h5 className="font-medium text-teal-800 mb-2">Included Sessions:</h5>
                      {child.sub_sessions.map((subSession, subIndex) => (
                        <div key={subSession._id || subIndex} className="bg-white rounded p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{subSession.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{subSession.duration} min</span>
                              {hasAccess(parentSession) && (
                                <Button
                                  onClick={() => handleSubSessionAction(child, subSession)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                >
                                  <Play className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={(e) => handleChildAction(child, e, index)}
                      className="cursor-pointer w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {hasAccess(parentSession)
                        ? child.sub_sessions && child.sub_sessions.length > 0
                          ? expandedChildren[child._id || `child-${index}`] ? "Hide Sessions" : "View Sessions"
                          : "Start Session"
                        : `Purchase Collection - ${formatPrice(parentSession.price)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredChildSessions.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-xl text-slate-600">No programs found</p>
            <Button
              onClick={() => setSelectedChild("all")}
              variant="outline"
              className="mt-4"
            >
              Show All Programs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}