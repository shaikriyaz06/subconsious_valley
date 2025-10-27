import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b466b0cee8741d9176529a/56cf4bd54_SubconciousValley5.png" 
          alt="Subconscious Valley Logo" 
          className="h-24 w-auto mx-auto mb-8"
        />
      </motion.div>

      <motion.h1 
        className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Our Site is Evolving
      </motion.h1>

      <motion.p 
        className="text-lg text-slate-600 max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        We're currently making some improvements to bring you an even better experience. We'll be back online shortly. Thank you for your patience!
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="space-y-4"
      >
        <p className="text-slate-700">For any urgent inquiries, please reach out to us at:</p>
        <a href="mailto:hello@subconsciousvalley.com" className="flex items-center justify-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors">
          <Mail className="h-5 w-5" />
          hello@subconsciousvalley.com
        </a>
      </motion.div>

      <motion.div
        className="absolute bottom-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Link to={createPageUrl("AdminLogin")}>
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
            <Settings className="h-4 w-4 mr-2"/>
            Admin Login
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}