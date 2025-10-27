
import React, { useState, useEffect, useCallback } from "react";
import { SiteSettings, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Settings, CreditCard, Share2, Check, Home, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { UploadFile } from "@/api/integrations";

export default function AdminSettings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [formData, setFormData] = useState({
    stripe_publishable_key: "",
    stripe_secret_key: "",
    stripe_webhook_secret: "",
    stripe_test_mode: true,
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "https://www.youtube.com/@SubconsciousValley",
    linkedin_url: "",
    tiktok_url: "",
    support_email: "hello@subconsciousvalley.com", // Default value
    address: "Office 302, Shubbar Majed Building, Mankhool, Bur Dubai, Dubai, United Arab Emirates",
    hero_video_thumbnail_url: "",
    hero_video_link: "",
    hero_video_file_url: "",
    vanita_photo_url: "", // Added vanita_photo_url
    facebook_group_url: "" // Add new field to initial state
  });

  const loadSettings = useCallback(async () => {
    try {
      const siteSettings = await SiteSettings.list();
      if (siteSettings.length > 0) {
        // Merge fetched settings with default state to prevent missing fields
        setFormData(prev => ({...prev, ...siteSettings[0]}));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []); // Dependencies: setFormData is a stable setter, SiteSettings.list is external.

  const checkAdminAccess = useCallback(async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(userData);
      await loadSettings();
    } catch (error) {
      console.error('Admin access error:', error);
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  }, [loadSettings]); // Dependencies: loadSettings, setUser, setIsLoading are stable or passed as dependency

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]); // Dependencies: checkAdminAccess

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const existingSettings = await SiteSettings.list();
      
      if (existingSettings.length > 0) {
        await SiteSettings.update(existingSettings[0].id, formData);
      } else {
        await SiteSettings.create(formData);
      }
      
      setSavedMessage("Settings saved successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
    setIsSaving(false);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleManualInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, hero_video_file_url: file_url }));
      setSavedMessage("Video uploaded successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video');
    }
    setIsUploading(false);
  };

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, hero_video_thumbnail_url: file_url }));
      setSavedMessage("Thumbnail uploaded successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Error uploading thumbnail');
    }
    setIsUploading(false);
  };

  // New function for Vanita Pande's photo upload
  const handleVanitaPhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, vanita_photo_url: file_url }));
      setSavedMessage("Vanita's photo uploaded successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    }
    setIsUploading(false);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("AdminDashboard")}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Site Settings</h1>
              <p className="text-slate-600">Configure payment gateway, social media, and site preferences</p>
            </div>
          </div>
          {savedMessage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg"
            >
              <Check className="h-4 w-4" />
              {savedMessage}
            </motion.div>
          )}
        </div>

        <Tabs defaultValue="stripe" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stripe" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Gateway
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          {/* Stripe Settings */}
          <TabsContent value="stripe">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Stripe Payment Configuration
                </CardTitle>
                <p className="text-slate-600">
                  Configure your Stripe payment gateway. Get your keys from the Stripe Dashboard.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="stripe_publishable_key">Publishable Key</Label>
                    <Input
                      id="stripe_publishable_key"
                      value={formData.stripe_publishable_key || ""}
                      onChange={handleChange}
                      placeholder="pk_test_..."
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripe_secret_key">Secret Key</Label>
                    <Input
                      id="stripe_secret_key"
                      type="password"
                      value={formData.stripe_secret_key || ""}
                      onChange={handleChange}
                      placeholder="sk_test_..."
                      className="mt-1 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stripe_webhook_secret">Webhook Secret (Optional)</Label>
                  <Input
                    id="stripe_webhook_secret"
                    value={formData.stripe_webhook_secret || ""}
                    onChange={handleChange}
                    placeholder="whsec_..."
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Used to verify webhook requests from Stripe
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stripe_test_mode"
                    checked={formData.stripe_test_mode}
                    onCheckedChange={(checked) => handleManualInputChange('stripe_test_mode', checked)}
                  />
                  <Label htmlFor="stripe_test_mode" className="flex items-center gap-2">
                    Test Mode
                    <Badge className="bg-amber-100 text-amber-800">
                      {formData.stripe_test_mode ? 'Test' : 'Live'}
                    </Badge>
                  </Label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Getting Your Stripe Keys</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Visit <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="underline">dashboard.stripe.com</a></li>
                    <li>2. Go to Developers → API Keys</li>
                    <li>3. Copy your Publishable key and Secret key</li>
                    <li>4. Use test keys for development, live keys for production</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Settings */}
          <TabsContent value="social">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media Links
                </CardTitle>
                <p className="text-slate-600">
                  Add your social media profiles to display in the website footer.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="facebook_url">Facebook URL</Label>
                    <Input
                      id="facebook_url"
                      value={formData.facebook_url || ""}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourpage"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_url">Instagram URL</Label>
                    <Input
                      id="instagram_url"
                      value={formData.instagram_url || ""}
                      onChange={handleChange}
                      placeholder="https://instagram.com/yourprofile"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter_url">Twitter URL</Label>
                    <Input
                      id="twitter_url"
                      value={formData.twitter_url || ""}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourprofile"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube_url">YouTube URL</Label>
                    <Input
                      id="youtube_url"
                      value={formData.youtube_url || ""}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@yourchannel"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url || ""}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiktok_url">TikTok URL</Label>
                    <Input
                      id="tiktok_url"
                      value={formData.tiktok_url || ""}
                      onChange={handleChange}
                      placeholder="https://tiktok.com/@yourprofile"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook_group_url">Facebook Group URL</Label>
                    <Input 
                      id="facebook_group_url" 
                      value={formData.facebook_group_url || ""} 
                      onChange={handleChange} 
                      placeholder="https://facebook.com/groups/yourgroup"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Homepage Settings */}
          <TabsContent value="homepage">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Homepage Content Management
                </CardTitle>
                <p className="text-slate-600">
                  Update the hero video, thumbnail, and founder photo on your homepage.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Vanita Pande Photo Section */}
                <div>
                  <Label className="text-lg font-semibold">Vanita Pande Photo</Label>
                  <div className="mt-2 space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="mt-4">
                          <Label htmlFor="vanita-photo-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-slate-900">
                              Upload Vanita's Photo
                            </span>
                            <span className="mt-1 block text-sm text-slate-500">
                              JPG, PNG up to 10MB
                            </span>
                          </Label>
                          <Input
                            id="vanita-photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleVanitaPhotoUpload}
                            className="sr-only"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    </div>

                    {formData.vanita_photo_url && (
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800 mb-2">
                          ✓ Photo uploaded successfully
                        </p>
                        <img 
                          src={formData.vanita_photo_url} 
                          alt="Vanita Pande" 
                          className="w-32 h-40 object-cover rounded"
                        />
                      </div>
                    )}

                    <div className="text-center text-slate-500">OR</div>

                    <div>
                      <Label htmlFor="vanita_photo_url">Photo URL</Label>
                      <Input
                        id="vanita_photo_url"
                        value={formData.vanita_photo_url || ""}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Upload Section */}
                <div>
                  <Label className="text-lg font-semibold">Hero Video</Label>
                  <div className="mt-2 space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="mt-4">
                          <Label htmlFor="video-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-slate-900">
                              Upload Video File
                            </span>
                            <span className="mt-1 block text-sm text-slate-500">
                              MP4, WebM up to 100MB
                            </span>
                          </Label>
                          <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="sr-only"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {formData.hero_video_file_url && (
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800 mb-2">
                          ✓ Video uploaded successfully
                        </p>
                        <video 
                          src={formData.hero_video_file_url} 
                          className="w-48 h-32 object-cover rounded"
                          controls
                        />
                      </div>
                    )}

                    <div className="text-center text-slate-500">OR</div>

                    <div>
                      <Label htmlFor="hero_video_link">Video Link (YouTube, Vimeo, etc.)</Label>
                      <Input
                        id="hero_video_link"
                        value={formData.hero_video_link || ""}
                        onChange={handleChange}
                        placeholder="https://youtube.com/watch?v=..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload Section */}
                <div>
                  <Label className="text-lg font-semibold">Video Thumbnail</Label>
                  <div className="mt-2 space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="mt-4">
                          <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-slate-900">
                              Upload Thumbnail Image
                            </span>
                            <span className="mt-1 block text-sm text-slate-500">
                              JPG, PNG up to 10MB
                            </span>
                          </Label>
                          <Input
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="sr-only"
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    </div>

                    {formData.hero_video_thumbnail_url && (
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-800 mb-2">
                          ✓ Thumbnail uploaded successfully
                        </p>
                        <img 
                          src={formData.hero_video_thumbnail_url} 
                          alt="Video thumbnail" 
                          className="w-32 h-20 object-cover rounded"
                        />
                      </div>
                    )}

                    <div className="text-center text-slate-500">OR</div>

                    <div>
                      <Label htmlFor="hero_video_thumbnail_url">Thumbnail URL</Label>
                      <Input
                        id="hero_video_thumbnail_url"
                        value={formData.hero_video_thumbnail_url || ""}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <p className="text-slate-600">
                  Configure contact details displayed across the website.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="support_email">Support Email</Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={formData.support_email || ""}
                      onChange={handleChange}
                      placeholder="hello@subconsciousvalley.com"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      placeholder="Office 302, Shubbar Majed Building, Mankhool, Bur Dubai, Dubai, United Arab Emirates"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
            size="lg"
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : isUploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
