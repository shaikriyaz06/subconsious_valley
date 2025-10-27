import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, ArrowRight, Heart, Brain, Sparkles, Quote, MapPin, Mail, User, MessageCircle } from "lucide-react";
import { Session, Testimonial, SiteSettings } from "@/api/entities";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const [featuredSessions, setFeaturedSessions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [sessions, reviews, settingsData] = await Promise.all([
        Session.list('-created_date', 6),
        Testimonial.filter({featured: true}, '-created_date', 6),
        SiteSettings.list()
      ]);
      
      setFeaturedSessions(sessions);
      setTestimonials(reviews);
      if (settingsData.length > 0) {
        setSiteSettings(settingsData[0]);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const collections = [
    {
      name: t("body_confidence"),
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      sessions: ["Weightless Transformation", "Mindful Plate", "Sugar Freedom", "SLIMBAND Experience"],
      category_key: 'body_confidence'
    },
    {
      name: t("self_love"), 
      icon: Sparkles,
      color: "from-purple-500 to-violet-500",
      sessions: ["Glow Within", "Self-Love Boost"],
      category_key: 'self_love'
    },
    {
      name: t("emotional_healing"),
      icon: Brain,
      color: "from-teal-500 to-emerald-500", 
      sessions: ["Depression Relief", "Trauma Release", "Stress Release", "Anxiety Reset"],
      category_key: 'emotional_healing'
    },
    {
      name: t("freedom_path"),
      icon: Star,
      color: "from-amber-500 to-orange-500",
      sessions: ["Sober Freedom Journey", "Smoking Cessation", "Digital Detox Reset"],
      category_key: 'freedom_path'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Intro Video */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  {t('hero_title_1')}
                </span>
                <br />
                <span className="text-slate-800">{t('hero_title_2')}</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-4 leading-relaxed">
                {t('hero_subtitle')}
              </p>
              
              <p className="text-lg text-amber-600 font-medium mb-8">
                {t('heal_tagline')}
              </p>

              <p className="text-slate-700 mb-8 text-lg">
                {t('multilingual_support_desc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={createPageUrl("Sessions")}>
                  <Button size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-3">
                    {t('start_your_transformation')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Contact")}>
                  <Button size="lg" variant="outline" className="border-teal-200 hover:bg-teal-50">
                    {t('get_in_touch')}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Introduction Video */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl shadow-2xl overflow-hidden relative">
                {siteSettings.hero_video_file_url || siteSettings.hero_video_link ? (
                  <>
                    {siteSettings.hero_video_file_url ? (
                      // Show uploaded video file
                      <video 
                        className="w-full h-full object-cover"
                        poster={siteSettings.hero_video_thumbnail_url}
                        controls
                        preload="metadata"
                      >
                        <source src={siteSettings.hero_video_file_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // Show thumbnail with link to external video
                      <>
                        <img 
                          src={siteSettings.hero_video_thumbnail_url || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"}
                          alt="Vanita Pande Introduction Video"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <a 
                            href={siteSettings.hero_video_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button size="lg" className="bg-white/90 hover:bg-white text-teal-600 rounded-full w-20 h-20 shadow-xl">
                              <Play className="h-8 w-8 ml-1" />
                            </Button>
                          </a>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // Default fallback
                  <>
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                      alt="Vanita Pande Introduction Video"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button size="lg" className="bg-white/90 hover:bg-white text-teal-600 rounded-full w-20 h-20 shadow-xl">
                        <Play className="h-8 w-8 ml-1" />
                      </Button>
                    </div>
                  </>
                )}
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg">
                    <p className="font-medium">{t('video_welcome')}</p>
                    <p className="text-sm opacity-90">{t('video_discover')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Me Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img 
                  src={siteSettings.vanita_photo_url || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b466b0cee8741d9176529a/4a63f9d2a_vinitapande.jpg"}
                  alt="Vanita Pande - Founder of Subconscious Valley"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-xl shadow-lg">
                  <p className="font-semibold">{t('certifications_training')}</p>
                  <p className="font-semibold">{t('founder_title')}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-800">
                {t('meet_vanita')}
              </h2>
              <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500 mb-6">
                <p className="text-lg text-slate-700 italic leading-relaxed">
                  "{t('founder_intro_quote')}"
                </p>
              </div>
              
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('founder_intro_p1')}
              </p>
              
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {t('founder_intro_p2')}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">🧠 {t('science_based')}</h4>
                  <p className="text-sm text-slate-600">{t('science_based_desc')}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">🌏 {t('multilingual_support')}</h4>
                  <p className="text-sm text-slate-600">{t('multilingual_support_desc')}</p>
                </div>
              </div>
              
              <Link to={createPageUrl("About")} className="inline-block">
                <Button variant="outline" className="border-teal-200 hover:bg-teal-50">
                  {t('read_full_story')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-800">
              {t('transformation_stories')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('transformation_stories_desc')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} 
                          />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <Badge className="ml-auto bg-emerald-100 text-emerald-800 text-xs">{t('verified')}</Badge>
                      )}
                    </div>
                    
                    <Quote className="h-6 w-6 text-teal-500 mb-4" />
                    <p className="text-slate-700 mb-6 italic leading-relaxed">
                      "{testimonial.testimonial}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-sm text-slate-500">{testimonial.location}</p>
                        {testimonial.program_used && (
                          <p className="text-xs text-teal-600 mt-1">{testimonial.program_used}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              // Placeholder testimonials if none exist
              [
                {
                  name: "Sarah M.",
                  location: "Dubai, UAE",
                  rating: 5,
                  testimonial: t('testimonial_1'),
                  program: t("body_confidence")
                },
                {
                  name: "Ahmed K.", 
                  location: "Riyadh, KSA",
                  rating: 5,
                  testimonial: t('testimonial_2'),
                  program: t("emotional_healing")
                },
                {
                  name: "Priya S.",
                  location: "Mumbai, India", 
                  rating: 5,
                  testimonial: t('testimonial_3'),
                  program: t("self_love")
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                          ))}
                        </div>
                        <Badge className="ml-auto bg-emerald-100 text-emerald-800 text-xs">{t('verified')}</Badge>
                      </div>
                      
                      <Quote className="h-6 w-6 text-teal-500 mb-4" />
                      <p className="text-slate-700 mb-6 italic leading-relaxed">
                        "{testimonial.testimonial}"
                      </p>
                      
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{testimonial.name}</p>
                          <p className="text-sm text-slate-500">{testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Product Collections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-800">
              {t('our_collections')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('our_collections_desc')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${collection.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <collection.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{collection.name}</h3>
                    <div className="space-y-2 mb-6">
                      {collection.sessions.slice(0, 3).map((session) => (
                        <p key={session} className="text-sm text-slate-600">• {session}</p>
                      ))}
                      {collection.sessions.length > 3 && (
                        <p className="text-sm text-slate-500">+ {collection.sessions.length - 3} more...</p>
                      )}
                    </div>
                    <Link to={createPageUrl("Sessions") + `?category=${collection.category_key}`}>
                      <Button variant="outline" className="w-full">
                        {t('explore_collection')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl("Sessions")}>
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white">
                {t('view_all_sessions')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-800">
                {t('ready_to_start')}
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t('ready_to_start_desc')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{t('visit_us')}</p>
                    <p className="text-slate-600">Office 302, Shubbar Majed Building, Mankhool, Bur Dubai, Dubai, UAE</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{t('email_us')}</p>
                    <p className="text-slate-600">hello@subconsciousvalley.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 rounded-2xl text-white"
            >
              <h3 className="text-2xl font-bold mb-6">{t('get_in_touch')}</h3>
              <p className="mb-8 text-teal-100">
                {t('ready_to_start_desc')}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🌍 {t('multilingual_support')}</h4>
                  <p className="text-sm text-teal-100">{t('multilingual_support_contact_desc')}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">💬 {t('personal_consultation')}</h4>
                  <p className="text-sm text-teal-100">{t('personal_consultation_desc')}</p>
                </div>
              </div>
              
              <Link to={createPageUrl("Contact")}>
                <Button className="w-full bg-white text-teal-600 hover:bg-teal-50" size="lg">
                  {t('contact_us_now')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              {t('final_cta_title')}
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              {t('final_cta_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Sessions")}>
                <Button size="lg" className="bg-white text-teal-600 hover:bg-white hover:text-teal-600 px-8 py-3">
                  {t('browse_sessions')}
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
                  {t('get_started')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}