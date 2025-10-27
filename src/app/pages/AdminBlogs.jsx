import React, { useState, useEffect } from "react";
import { BlogPost, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, FileText, ArrowLeft, Save, X, Eye, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function AdminBlogs() {
  const [user, setUser] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    title_en: "",
    content_en: "",
    excerpt_en: "",
    title_ar: "",
    content_ar: "",
    excerpt_ar: "",
    title_hi: "",
    content_hi: "",
    excerpt_hi: "",
    featured_image: "",
    tags: [],
    published: true,
    read_time: 5
  });

  const loadBlogPosts = async () => {
    try {
      const postsData = await BlogPost.list('-created_date');
      setBlogPosts(postsData);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  };

  const checkAdminAccess = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(userData);
      await loadBlogPosts();
    } catch (error) {
      console.error('Admin access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAdminAccess();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        // Set default fields from English version
        title: formData.title_en || formData.title,
        excerpt: formData.excerpt_en || formData.excerpt,
        content: formData.content_en || formData.content,
        slug: formData.slug || generateSlug(formData.title_en || formData.title),
        tags: formData.tags.filter(tag => tag.trim())
      };

      if (editingPost) {
        await BlogPost.update(editingPost.id, postData);
      } else {
        await BlogPost.create(postData);
      }
      
      resetForm();
      await loadBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      ...post,
      tags: post.tags || []
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await BlogPost.delete(postId);
      await loadBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      title_en: "",
      content_en: "",
      excerpt_en: "",
      title_ar: "",
      content_ar: "",
      excerpt_ar: "",
      title_hi: "",
      content_hi: "",
      excerpt_hi: "",
      featured_image: "",
      tags: [],
      published: true,
      read_time: 5
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleTagsChange = (tagsString) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminDashboard")}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Manage Blog Posts</h1>
              <p className="text-slate-600">Create and edit blog articles</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Write New Post
          </Button>
        </div>

        {/* Blog Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {editingPost ? 'Edit Blog Post' : 'Write New Blog Post'}
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* General settings */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        required
                        className="mt-1"
                        placeholder="url-friendly-title"
                      />
                    </div>
                     <div>
                      <Label htmlFor="featured_image">Featured Image URL</Label>
                      <Input
                        id="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        className="mt-1"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Translation Fields */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                      <Languages className="h-5 w-5 text-purple-600" />
                      Content Translations
                    </h3>
                    <div className="space-y-4">
                      {/* English */}
                      <div>
                        <Label>Content (English) *</Label>
                        <Input
                          value={formData.title_en}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setFormData({
                              ...formData,
                              title: newTitle,
                              title_en: newTitle,
                              slug: generateSlug(newTitle)
                            });
                          }}
                          placeholder="Post Title (EN)"
                          required
                          className="mt-1"
                        />
                        <Textarea
                          value={formData.excerpt_en}
                          onChange={(e) => setFormData({...formData, excerpt_en: e.target.value, excerpt: e.target.value})}
                          rows={2}
                          placeholder="Excerpt (EN)"
                          className="mt-2"
                        />
                        <Textarea
                          value={formData.content_en}
                          onChange={(e) => setFormData({...formData, content_en: e.target.value, content: e.target.value})}
                          rows={8}
                          placeholder="Full Content (EN, Markdown)"
                          className="mt-2"
                        />
                      </div>
                      {/* Arabic */}
                      <div>
                        <Label>Content (Arabic)</Label>
                        <Input
                          value={formData.title_ar}
                          onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                          placeholder="Post Title (AR)"
                          className="mt-1"
                          dir="rtl"
                        />
                        <Textarea
                          value={formData.excerpt_ar}
                          onChange={(e) => setFormData({...formData, excerpt_ar: e.target.value})}
                          rows={2}
                          placeholder="Excerpt (AR)"
                          className="mt-2"
                          dir="rtl"
                        />
                         <Textarea
                          value={formData.content_ar}
                          onChange={(e) => setFormData({...formData, content_ar: e.target.value})}
                          rows={8}
                          placeholder="Full Content (AR, Markdown)"
                          className="mt-2"
                          dir="rtl"
                        />
                      </div>
                      {/* Hindi */}
                      <div>
                        <Label>Content (Hindi)</Label>
                        <Input
                          value={formData.title_hi}
                          onChange={(e) => setFormData({...formData, title_hi: e.target.value})}
                          placeholder="Post Title (HI)"
                          className="mt-1"
                        />
                        <Textarea
                          value={formData.excerpt_hi}
                          onChange={(e) => setFormData({...formData, excerpt_hi: e.target.value})}
                          rows={2}
                          placeholder="Excerpt (HI)"
                          className="mt-2"
                        />
                        <Textarea
                          value={formData.content_hi}
                          onChange={(e) => setFormData({...formData, content_hi: e.target.value})}
                          rows={8}
                          placeholder="Full Content (HI, Markdown)"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        className="mt-1"
                        placeholder="hypnotherapy, wellness"
                      />
                    </div>
                    <div>
                      <Label htmlFor="read_time">Read Time (minutes)</Label>
                      <Input
                        id="read_time"
                        type="number"
                        value={formData.read_time}
                        onChange={(e) => setFormData({...formData, read_time: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingPost ? 'Update Post' : 'Publish Post'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Blog Posts List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  {post.featured_image && (
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight line-clamp-2">{post.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(post)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {post.excerpt || "No excerpt available"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={post.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant="outline">
                      {post.read_time || 5}min read
                    </Badge>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      {new Date(post.created_date).toLocaleDateString()}
                    </div>
                    <Link to={createPageUrl("BlogPost") + `?slug=${post.slug}`} target="_blank">
                      <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-700">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-slate-600 mb-4">No blog posts found</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Write Your First Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}