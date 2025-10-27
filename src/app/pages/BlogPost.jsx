
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BlogPost } from "@/api/entities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added import for Button
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/components/LanguageProvider";

export default function BlogPostPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    const loadPost = async () => {
      try {
        const posts = await BlogPost.filter({ slug: slug }, '-created_date', 1);
        if (posts.length > 0) {
          setPost(posts[0]);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      }
      setIsLoading(false);
    };

    loadPost();
  }, [slug]);
  
  const getTranslated = (item, field) => {
    if (!item) return "";
    const langField = `${field}_${currentLanguage}`;
    return item[langField] || item[field];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center text-center p-4">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-red-600 mb-4">Post Not Found</h2>
            <p className="text-slate-600 mb-6">The article you are looking for does not exist.</p>
            <Link to={createPageUrl("Blog")}>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <Link to={createPageUrl("Blog")}>
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('blog')}
              </Button>
            </Link>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
            {post.featured_image && (
              <CardHeader className="p-0">
                <div className="aspect-video">
                  <img src={post.featured_image} alt={getTranslated(post, 'title')} className="w-full h-full object-cover" />
                </div>
              </CardHeader>
            )}
            <CardContent className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight">
                {getTranslated(post, 'title')}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 mb-6">
                 <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Subconscious Valley</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.created_date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.read_time || 5} {t('min_read')}</span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}

              <article className="prose prose-lg max-w-none prose-teal">
                <ReactMarkdown>{getTranslated(post, 'content')}</ReactMarkdown>
              </article>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
