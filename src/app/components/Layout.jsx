"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from 'next/navigation'
// import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Globe, ChevronDown, User, LogOut, Facebook, Instagram, Twitter, Youtube, Linkedin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { User as UserEntity } from "@/api/entities";
// import { SiteSettings } from "@/api/entities";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { CurrencyProvider, CurrencySelector } from "@/components/CurrencyConverter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
];

function LayoutContent({ children, currentPageName }) {
  const pathname = usePathname();
  
  // Debug: log the current pathname
  console.log('Current pathname:', pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState({});
  const { currentLanguage, changeLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    checkAuth();
    loadSiteSettings();
  }, []);

  const checkAuth = async () => {
    try {
      // const userData = await UserEntity.me();
      setUser("userData");
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const loadSiteSettings = async () => {
    try {
      // const settings = await SiteSettings.list();
      // if (settings.length > 0) {
      if ([].length > 0) {
        setSocialLinks(settings[0]);
      }
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await UserEntity.loginWithRedirect(window.location.origin + createPageUrl("Dashboard"));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await UserEntity.logout();
    setUser(null);
    window.location.href = createPageUrl("Home");
  };

  const getDashboardUrl = () => {
    if (user?.role === 'admin') {
      return createPageUrl("AdminDashboard");
    }
    if (user?.role === 'team_member') {
      return createPageUrl("TeamDashboard");
    }
    return createPageUrl("Dashboard");
  };

  const navigationItems = [
    { name: t('home'), href: "/" },
    // { name: t('about'), href: "/about" },
    { name: t('sessions'), href: "/sessions" },
    // { name: t('blog'), href: "/blog"},
    // { name: t('contact'), href: "/contact" }
  ];

  const socialIcons = [
    { key: 'facebook_url', icon: Facebook, color: 'hover:text-blue-600' },
    { key: 'instagram_url', icon: Instagram, color: 'hover:text-pink-600' },
    { key: 'twitter_url', icon: Twitter, color: 'hover:text-blue-400' },
    { key: 'youtube_url', icon: Youtube, color: 'hover:text-red-600' },
    { key: 'linkedin_url', icon: Linkedin, color: 'hover:text-blue-700' }
  ];

  return (
    <CurrencyProvider>
      <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b466b0cee8741d9176529a/56cf4bd54_SubconciousValley5.png" alt="Subconscious Valley Logo" className="h-12 w-auto" />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  console.log(`Checking ${item.name}: pathname='${pathname}' vs href='${item.href}' = ${isActive}`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors duration-200 hover:text-teal-600 ${
                        isActive ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : 'text-slate-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                {/* Currency Selector */}
                <div className="hidden sm:flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <CurrencySelector />
                </div>

                {/* Language Switcher */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">{languages.find(l => l.code === currentLanguage)?.flag}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {languages.map((lang) => (
                      <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                {!isLoading && (
                  user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm hidden sm:block">{user.full_name}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link to={getDashboardUrl()} className="flex items-center w-full">
                            <User className="mr-2 h-4 w-4" />
                            {t('dashboard')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          {t('logout')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                      onClick={handleLogin}
                    >
                      {t('login')}
                    </Button>
                  )
                )}

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {isMenuOpen && (
              <div className="md:hidden py-4 space-y-4 border-t border-teal-100">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="pt-4 pb-3 border-t border-teal-100">
                  <div className="px-5 space-y-3">
                    {/* Currency Selector for Mobile */}
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                      <CurrencySelector />
                    </div>

                    {/* Language Selector for Mobile */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Globe className="mr-2 h-4 w-4" />
                          {languages.find(l => l.code === currentLanguage)?.name}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {languages.map((lang) => (
                          <DropdownMenuItem key={lang.code} onClick={() => {changeLanguage(lang.code); setIsMenuOpen(false);}}>
                            <span className="mr-2">{lang.flag}</span>
                            {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {!user && (
                    <div className="mt-6 px-5">
                      <Button 
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                        onClick={() => {handleLogin(); setIsMenuOpen(false);}}
                      >
                        {t('login')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <Link href="/">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b466b0cee8741d9176529a/56cf4bd54_SubconciousValley5.png" alt="Subconscious Valley Logo" className="h-12 w-auto bg-white p-1 rounded" />
                  </Link>
                </div>
                <p className="text-slate-300 mb-4">
                  {t('hero_subtitle')}
                </p>
                
                <div className="text-sm text-slate-400 space-y-1 mb-4">
                  <p>📍 Dubai, United Arab Emirates</p>
                  <p>✉️ hello@subconsciousvalley.com</p>
                </div>
                
                {/* Social Media Links */}
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/subconsciousvalley/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-pink-400 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@SubconsciousValley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@subconciousvalley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.5z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t('quick_links')}</h4>
                <ul className="space-y-2 text-slate-300">
                  <li><Link href="/" className="hover:text-teal-400">{t('home')}</Link></li>
                  <li><Link href="/sessions" className="hover:text-teal-400">{t('sessions')}</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t('legal')}</h4>
                <ul className="space-y-2 text-slate-300">
                  <li><Link href="Privacy" className="hover:text-teal-400">{t('privacy_policy')}</Link></li>
                  <li><Link href="Terms" className="hover:text-teal-400">{t('terms_conditions')}</Link></li>
                  <li><Link href="AdminLogin" className="hover:text-teal-400">{t('admin')}</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; {new Date().getFullYear()} {t('brand_name')}. {t('all_rights_reserved')}</p>
            </div>
          </div>
        </footer>
      </div>
    </CurrencyProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </LanguageProvider>
  );
}

