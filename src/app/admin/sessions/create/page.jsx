"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { uploadToCloudflare } from '@/utils/uploadToCloudflare';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

export default function CreateSession() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    languages: [],
    required_plan: 'free',
    image_url: '',
    price: 0,
    original_price: 0,
    discount_percentage: 0,
    currency: 'AED',
    is_sample: false,
    child_sessions: []
  });

  const categories = [
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'focus', label: 'Focus' },
    { value: 'healing', label: 'Healing' },
    { value: 'success', label: 'Success' }
  ];

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'indian_english', label: 'Indian English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'tagalog', label: 'Tagalog' },
    { value: 'chinese', label: 'Chinese' }
  ];

  const uploadFileToCloudflare = async (file, fileName) => {
    // Clean both custom filename and original filename
    const cleanFileName = fileName.trim().replace(/\s+/g, '-');
    const cleanOriginalName = file.name.replace(/\s+/g, '-');
    const fileExtension = cleanOriginalName.split('.').pop();
    const finalFileName = cleanFileName + '.' + fileExtension;
    
    // Create a new file with the cleaned name
    const renamedFile = new File([file], finalFileName, {
      type: file.type,
    });

    const formData = new FormData();
    formData.append("files", renamedFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    return data.url || data.files[0].url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedFormData = { ...formData };

      // Upload main session image if it's a file
      if (formData.image_url && formData.image_url instanceof File) {
        const imageUrl = await uploadFileToCloudflare(
          formData.image_url,
          `session-new-image`
        );
        updatedFormData.image_url = imageUrl;
      }

      // Upload child and sub-session files
      if (formData.child_sessions) {
        for (let i = 0; i < formData.child_sessions.length; i++) {
          const child = formData.child_sessions[i];
          
          // Upload child session image
          if (child.image_url && child.image_url instanceof File) {
            const imageUrl = await uploadFileToCloudflare(
              child.image_url,
              `session-new-child-${i}-image`
            );
            updatedFormData.child_sessions[i].image_url = imageUrl;
          }
          
          if (child.sub_sessions) {
            for (let k = 0; k < child.sub_sessions.length; k++) {
              const subSession = child.sub_sessions[k];

              // Upload sub-session audio files
              if (subSession.audio_urls) {
                for (const [lang, audioFile] of Object.entries(subSession.audio_urls)) {
                  if (audioFile && audioFile instanceof File) {
                    const audioUrl = await uploadFileToCloudflare(
                      audioFile,
                      `session-new-child-${i}-sub-${k}-${lang}-audio`
                    );
                    updatedFormData.child_sessions[i].sub_sessions[k].audio_urls[lang] = audioUrl;
                  }
                }
              }

              // Upload sub-session materials
              if (subSession.materials) {
                for (let l = 0; l < subSession.materials.length; l++) {
                  const material = subSession.materials[l];
                  if (material.link && material.link instanceof File) {
                    const materialUrl = await uploadFileToCloudflare(
                      material.link,
                      `session-new-child-${i}-sub-${k}-material-${l}`
                    );
                    updatedFormData.child_sessions[i].sub_sessions[k].materials[l].link = materialUrl;
                  }
                }
              }
            }
          }
        }
      }

      const cleanedData = {
        ...updatedFormData,
        child_sessions: updatedFormData.child_sessions.map(child => ({
          ...child,
          image_url: typeof child.image_url === 'string' ? child.image_url : '',
          sub_sessions: (child.sub_sessions || []).map(sub => ({
            ...sub,
            audio_urls: {
              hindi: typeof sub.audio_urls?.hindi === 'string' ? sub.audio_urls.hindi : '',
              english: typeof sub.audio_urls?.english === 'string' ? sub.audio_urls.english : '',
              arabic: typeof sub.audio_urls?.arabic === 'string' ? sub.audio_urls.arabic : ''
            },
            materials: (sub.materials || []).filter(material => 
              material.name && material.name.trim() && material.link
            ).map(material => ({
              name: typeof material.name === 'string' ? material.name : '',
              link: typeof material.link === 'string' ? material.link : ''
            }))
          }))
        }))
      };

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        window.location.href = `/sessions?created=${Date.now()}`;
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (file) => {
    setFormData(prev => ({...prev, image_url: file}));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const addChildSession = () => {
    setFormData(prev => ({
      ...prev,
      child_sessions: [...prev.child_sessions, {
        title: '',
        description: '',
        image_url: '',
        sub_sessions: []
      }]
    }));
  };

  const removeChildSession = (index) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.filter((_, i) => i !== index)
    }));
  };

  const handleChildSessionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const addSubSession = (childIndex) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex ? {
          ...child,
          sub_sessions: [...(child.sub_sessions || []), {
            title: '',
            description: '',
            duration: 25,
            audio_urls: { hindi: '', english: '', arabic: '' },
            image_url: '',
            materials: []
          }]
        } : child
      )
    }));
  };

  const removeSubSession = (childIndex, subIndex) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex ? {
          ...child,
          sub_sessions: child.sub_sessions.filter((_, j) => j !== subIndex)
        } : child
      )
    }));
  };

  const handleSubSessionChange = (childIndex, subIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex ? {
          ...child,
          sub_sessions: child.sub_sessions.map((sub, j) =>
            j === subIndex ? { ...sub, [field]: value } : sub
          )
        } : child
      )
    }));
  };

  const handleSubAudioChange = (childIndex, subIndex, language, url) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex ? {
          ...child,
          sub_sessions: child.sub_sessions.map((sub, j) =>
            j === subIndex ? {
              ...sub,
              audio_urls: { ...sub.audio_urls, [language]: url }
            } : sub
          )
        } : child
      )
    }));
  };

  const addSubMaterial = (childIndex, subIndex) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex ? {
          ...child,
          sub_sessions: child.sub_sessions.map((sub, j) =>
            j === subIndex ? {
              ...sub,
              materials: [...(sub.materials || []), { name: '', link: '' }]
            } : sub
          )
        } : child
      )
    }));
  };

  const removeSubMaterial = (childIndex, subIndex, materialIndex) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex ? {
          ...child,
          sub_sessions: child.sub_sessions.map((sub, j) =>
            j === subIndex ? {
              ...sub,
              materials: sub.materials.filter((_, k) => k !== materialIndex)
            } : sub
          )
        } : child
      )
    }));
  };

  const handleSubMaterialChange = (childIndex, subIndex, materialIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex ? {
          ...child,
          sub_sessions: child.sub_sessions.map((sub, j) =>
            j === subIndex ? {
              ...sub,
              materials: sub.materials.map((material, k) =>
                k === materialIndex ? { ...material, [field]: value } : material
              )
            } : sub
          )
        } : child
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 py-8">
      {saving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
            <span className="text-slate-700">Creating session...</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/sessions")}
                className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sessions
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Create New Session
                </h1>
                <p className="text-gray-600 mt-1">
                  Create a new session with content and settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Primary Content */}
            <div className="lg:col-span-2 space-y-8 lg:pr-4">
              {/* Basic Information */}
              <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Session Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                        placeholder="Enter session title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Category *
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      rows={4}
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg resize-none"
                      placeholder="Describe your session..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Settings */}
              <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    Pricing & Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                        Current Price (AED)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({...prev, price: Number(e.target.value)}))}
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="original_price" className="text-sm font-medium text-gray-700">
                        Original Price (AED)
                      </Label>
                      <Input
                        id="original_price"
                        type="number"
                        value={formData.original_price}
                        onChange={(e) => setFormData(prev => ({...prev, original_price: Number(e.target.value)}))}
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
                        Discount %
                      </Label>
                      <Input
                        id="discount"
                        type="number"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData(prev => ({...prev, discount_percentage: Number(e.target.value)}))}
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Session Image
                    </Label>
                    <FileUpload
                      value={formData.image_url}
                      onChange={handleImageUpload}
                      accept="image/*"
                      placeholder="Upload session image"
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Checkbox
                      id="is_sample"
                      checked={formData.is_sample}
                      onCheckedChange={(checked) => setFormData(prev => ({...prev, is_sample: checked}))}
                      className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <Label htmlFor="is_sample" className="text-sm font-medium text-gray-700">
                      Mark as Sample Session
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Child Sessions */}
              {formData.child_sessions && formData.child_sessions.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                        <div className="w-3 h-3 bg-violet-500 rounded-full mr-3"></div>
                        Child Sessions ({formData.child_sessions.length})
                      </CardTitle>
                      <Button
                        type="button"
                        onClick={addChildSession}
                        variant="outline"
                        size="sm"
                        className="hover:bg-violet-100 border-violet-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Session
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <Accordion type="multiple" className="space-y-4">
                      {formData.child_sessions?.map((child, index) => (
                        <AccordionItem
                          key={index}
                          value={`session-${index}`}
                          className="border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center">
                            <AccordionTrigger className="flex-1 px-4 py-3 hover:no-underline">
                              <span className="font-semibold text-slate-800">
                                Session {index + 1}: {child.title || "Untitled"}
                              </span>
                            </AccordionTrigger>
                            <Button
                              type="button"
                              onClick={() => removeChildSession(index)}
                              variant="destructive"
                              size="sm"
                              className="mr-4"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <AccordionContent className="px-4 pb-4 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Title</Label>
                                <Input
                                  value={child.title || ""}
                                  onChange={(e) => handleChildSessionChange(index, "title", e.target.value)}
                                  placeholder="Enter child session title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Image</Label>
                                <FileUpload
                                  value={child.image_url || ""}
                                  onChange={(value) => handleChildSessionChange(index, "image_url", value)}
                                  accept="image/*"
                                  placeholder="Upload child session image"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Description</Label>
                              <Textarea
                                value={child.description || ""}
                                onChange={(e) => handleChildSessionChange(index, "description", e.target.value)}
                                rows={3}
                                placeholder="Describe this child session..."
                              />
                            </div>

                            {/* Sub-Sessions */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-gray-700">
                                  Sub-Sessions ({(child.sub_sessions || []).length})
                                </Label>
                                <Button
                                  type="button"
                                  onClick={() => addSubSession(index)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Sub-Session
                                </Button>
                              </div>
                              
                              {(child.sub_sessions || []).map((subSession, subIndex) => (
                                <div key={subIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h6 className="text-sm font-medium text-gray-800">
                                      Sub-Session {subIndex + 1}: {subSession.title || "Untitled"}
                                    </h6>
                                    <Button
                                      type="button"
                                      onClick={() => removeSubSession(index, subIndex)}
                                      variant="destructive"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-gray-600">Title</Label>
                                      <Input
                                        value={subSession.title || ""}
                                        onChange={(e) => handleSubSessionChange(index, subIndex, "title", e.target.value)}
                                        placeholder="Sub-session title"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-gray-600">Duration (min)</Label>
                                      <Input
                                        type="number"
                                        value={subSession.duration || 25}
                                        onChange={(e) => handleSubSessionChange(index, subIndex, "duration", Number(e.target.value))}
                                        placeholder="25"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-gray-600">Description</Label>
                                    <Textarea
                                      value={subSession.description || ""}
                                      onChange={(e) => handleSubSessionChange(index, subIndex, "description", e.target.value)}
                                      rows={2}
                                      placeholder="Sub-session description"
                                    />
                                  </div>
                                  
                                  {/* Sub-session Materials */}
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs font-medium text-gray-600">Materials</Label>
                                      <Button
                                        type="button"
                                        onClick={() => addSubMaterial(index, subIndex)}
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                      </Button>
                                    </div>
                                    {(subSession.materials || []).map((material, materialIndex) => (
                                      <div key={materialIndex} className="p-3 bg-white rounded border space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-medium text-gray-600">
                                            Material {materialIndex + 1}
                                          </span>
                                          <Button
                                            type="button"
                                            onClick={() => removeSubMaterial(index, subIndex, materialIndex)}
                                            variant="destructive"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <Input
                                          value={material.name || ""}
                                          onChange={(e) => handleSubMaterialChange(index, subIndex, materialIndex, "name", e.target.value)}
                                          placeholder="Material name"
                                        />
                                        <FileUpload
                                          value={material.link || ""}
                                          onChange={(value) => handleSubMaterialChange(index, subIndex, materialIndex, "link", value)}
                                          accept=".pdf,.doc,.docx,.txt"
                                          placeholder="Upload material"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {/* Sub-session Audio Files */}
                                  <div className="space-y-3">
                                    <Label className="text-xs font-medium text-gray-600">Audio Files</Label>
                                    <div className="grid grid-cols-1 gap-3">
                                      <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">English</Label>
                                        <FileUpload
                                          value={subSession.audio_urls?.english || ""}
                                          onChange={(value) => handleSubAudioChange(index, subIndex, "english", value)}
                                          accept="audio/*"
                                          placeholder="English audio"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Hindi</Label>
                                        <FileUpload
                                          value={subSession.audio_urls?.hindi || ""}
                                          onChange={(value) => handleSubAudioChange(index, subIndex, "hindi", value)}
                                          accept="audio/*"
                                          placeholder="Hindi audio"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs text-gray-500">Arabic</Label>
                                        <FileUpload
                                          value={subSession.audio_urls?.arabic || ""}
                                          onChange={(value) => handleSubAudioChange(index, subIndex, "arabic", value)}
                                          accept="audio/*"
                                          placeholder="Arabic audio"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* Add Child Session Button */}
              {(!formData.child_sessions || formData.child_sessions.length === 0) && (
                <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <Button
                      type="button"
                      onClick={addChildSession}
                      variant="outline"
                      className="hover:bg-violet-50 border-violet-200 text-violet-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Child Sessions Collection
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Convert this session into a collection of multiple sessions
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Languages Card */}
              <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    {languages.map((lang) => (
                      <div
                        key={lang.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={lang.value}
                          checked={formData.languages.includes(lang.value)}
                          onCheckedChange={() => handleLanguageToggle(lang.value)}
                          className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                        />
                        <Label
                          htmlFor={lang.value}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {lang.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Actions */}
          <div className="mt-8">
            <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/sessions")}
                    className="border-gray-200 hover:bg-gray-50 px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Creating..." : "Create Session"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}