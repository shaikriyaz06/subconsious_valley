"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/utils";
// import { BlogPost } from "@/api/entities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useLanguage } from "@/components/LanguageProvider";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/blog-posts');
      const blogPosts = await response.json();
      setPosts(blogPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
    setIsLoading(false);
  };
  
  const getTranslated = (item, field) => {
    const langField = `${field}_${currentLanguage}`;
    return item[langField] || item[field];
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <button 
              onClick={() => setSelectedPost(null)} 
              className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-8"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Blog
            </button>

            <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
              {selectedPost.featured_image && (
                <div className="aspect-video">
                  <img 
                    src={selectedPost.featured_image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedPost?.createdAt ? format(new Date(selectedPost.createdAt), "MMM d, yyyy") : "Recent"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedPost.read_time || 5} min read
                  </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                  {selectedPost.title}
                </h1>

                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-slate-800">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={index} className="font-bold mb-4">{paragraph.replace(/\*\*/g, '')}</p>;
                    }
                    if (paragraph.startsWith('* ')) {
                      return <li key={index} className="mb-2">{paragraph.replace('* ', '')}</li>;
                    }
                    if (paragraph.trim()) {
                      return <p key={index} className="mb-4 text-slate-700 leading-relaxed">{paragraph}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </article>
          </motion.div>
        </div>
      </div>
    );
  }

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
              {t('blog_title')}
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('blog_desc')}
          </p>
        </motion.div>

        {/* Featured Article - if we have posts */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border-0">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto">
                  <img 
                    src={posts[0].featured_image}
                    alt={getTranslated(posts[0], 'title')}
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className="bg-teal-100 text-teal-800 w-fit mb-4">{t('featured_article')}</Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-slate-800 leading-tight">
                    {getTranslated(posts[0], 'title')}
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {getTranslated(posts[0], 'excerpt')}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {posts[0]?.createdAt ? format(new Date(posts[0].createdAt), "MMM d, yyyy") : "Recent"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {posts[0].read_time || 5} {t('min_read')}
                    </div>
                  </div>
                  <Link href={`/blog/${posts[0].slug}`}>
                    <div className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium group">
                      {t('read_full_article')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl h-80"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post, index) => (
              <motion.div
                key={post._id || post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
                  <CardHeader className="p-0">
                    <div className="aspect-video overflow-hidden rounded-t-2xl">
                      <img 
                        src={post.featured_image}
                        alt={getTranslated(post, 'title')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-teal-600 transition-colors leading-tight">
                      {getTranslated(post, 'title')}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">
                      {getTranslated(post, 'excerpt')}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post?.createdAt ? format(new Date(post.createdAt), "MMM d") : "Recent"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.read_time || 5} min
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Link href={`/blog/${post.slug}`}>
                      <div className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium group">
                        {t('read_more')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {posts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-xl text-slate-600">{t('no_blog_posts')}</p>
            <p className="text-slate-500 mt-2">{t('check_back_soon')}</p>
          </div>
        )}
      </div>
    </div>
  );
}