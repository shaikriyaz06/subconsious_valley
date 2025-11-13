"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FileUpload } from "@/components/ui/file-upload";

export default function EditSession() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    category: "",
    duration: 25,
    languages: [],
    audio_urls: {
      hindi: "",
      english: "",
      arabic: "",
    },
    preview_url: "",
    image_url: "",
    materials: "",
    price: 0,
    original_price: 0,
    discount_percentage: 0,
    currency: "AED",
    is_sample: false,
  });

  const categories = [
    { value: "anxiety", label: "Anxiety" },
    { value: "confidence", label: "Confidence" },
    { value: "sleep", label: "Sleep" },
    { value: "focus", label: "Focus" },
    { value: "healing", label: "Healing" },
    { value: "success", label: "Success" },
  ];

  const availableLanguages = [
    { value: "english", label: "English" },
    { value: "indian_english", label: "Indian English" },
    { value: "hindi", label: "हिंदी" },
    { value: "arabic", label: "العربية" },
    { value: "tagalog", label: "Tagalog" },
    { value: "chinese", label: "中文" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (session && session.user?.role !== "admin") {
      router.push("/");
      return;
    }
    loadSession();
  }, [params.id, session, mounted]);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/sessions/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setSessionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAudioUrlChange = (language, url) => {
    setSessionData((prev) => ({
      ...prev,
      audio_urls: { ...prev.audio_urls, [language]: url },
    }));
  };

  const handleLanguageToggle = (language) => {
    setSessionData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleChildSessionChange = (index, field, value) => {
    setSessionData((prev) => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      ),
    }));
  };

  const handleChildMaterialChange = (
    childIndex,
    materialIndex,
    field,
    value
  ) => {
    setSessionData((prev) => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex
          ? {
              ...child,
              materials: child.materials.map((material, j) =>
                j === materialIndex ? { ...material, [field]: value } : material
              ),
            }
          : child
      ),
    }));
  };

  const addChildMaterial = (childIndex) => {
    setSessionData((prev) => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex
          ? {
              ...child,
              materials: [...(child.materials || []), { name: "", link: "" }],
            }
          : child
      ),
    }));
  };

  const removeChildMaterial = (childIndex, materialIndex) => {
    setSessionData((prev) => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === childIndex
          ? {
              ...child,
              materials: child.materials.filter((_, j) => j !== materialIndex),
            }
          : child
      ),
    }));
  };

  const handleChildAudioChange = (index, language, url) => {
    setSessionData((prev) => ({
      ...prev,
      child_sessions: prev.child_sessions.map((child, i) =>
        i === index
          ? {
              ...child,
              audio_urls: { ...child.audio_urls, [language]: url },
            }
          : child
      ),
    }));
  };

  const childSessionRefs = useRef([]);

  const addChildSession = () => {
    setSessionData((prev) => {
      const newChildSessions = [
        ...(prev.child_sessions || []),
        {
          title: "",
          description: "",
          duration: 25,
          audio_urls: { hindi: "", english: "", arabic: "" },
          image_url: "",
          order: (prev.child_sessions?.length || 0) + 1,
        },
      ];

      setTimeout(() => {
        const newIndex = newChildSessions.length - 1;
        childSessionRefs.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      return { ...prev, child_sessions: newChildSessions };
    });
  };

  const removeChildSession = (index) => {
    setSessionData((prev) => ({
      ...prev,
      child_sessions: prev.child_sessions.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!sessionData.title?.trim()) {
      errors.push("Title is required");
    }

    if (!sessionData.category) {
      errors.push("Category is required");
    }

    if (sessionData.price < 0) {
      errors.push("Price cannot be negative");
    }

    // Validate main session audio files
    if (sessionData.audio_urls) {
      Object.entries(sessionData.audio_urls).forEach(([lang, audioFile]) => {
        if (
          audioFile &&
          audioFile instanceof File &&
          !audioFile.name.toLowerCase().endsWith(".mp3")
        ) {
          errors.push(`${lang} audio file must be in MP3 format`);
        }
      });
    }

    if (sessionData.child_sessions?.length > 0) {
      sessionData.child_sessions.forEach((child, index) => {
        if (!child.title?.trim()) {
          errors.push(`Child session ${index + 1} title is required`);
        }
        if (!child.duration || child.duration <= 0) {
          errors.push(
            `Child session ${index + 1} duration must be greater than 0`
          );
        }

        // Validate child session audio files
        if (child.audio_urls) {
          Object.entries(child.audio_urls).forEach(([lang, audioFile]) => {
            if (
              audioFile &&
              audioFile instanceof File &&
              !audioFile.name.toLowerCase().endsWith(".mp3")
            ) {
              errors.push(
                `Child session ${
                  index + 1
                } ${lang} audio file must be in MP3 format`
              );
            }
          });
        }
      });
    } else {
      if (!sessionData.duration || sessionData.duration <= 0) {
        errors.push("Duration must be greater than 0");
      }
    }

    return errors;
  };

  const uploadFileToCloudflare = async (file, fileName) => {
    // Clean filename: trim spaces and replace spaces with hyphens
    const cleanFileName = fileName.trim().replace(/\s+/g, '-');
    const fileExtension = file.name.split('.').pop();
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

  const shouldConvertToCDN = (url) => {
    return url && typeof url === 'string' && !url.startsWith('https://cdn.subconsciousvalley.workers.dev/');
  };

  const handleSave = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      alert("Please fix the following errors:\n" + validationErrors.join("\n"));
      return;
    }

    setIsSaving(true);
    try {
      const updatedSessionData = { ...sessionData };

      // Upload main session image if it's a file
      if (sessionData.image_url && sessionData.image_url instanceof File) {
        const imageUrl = await uploadFileToCloudflare(
          sessionData.image_url,
          `session-${params.id}-image`
        );
        updatedSessionData.image_url = imageUrl;
      }

      // Upload main session audio files if they are files or convert URLs to CDN
      if (sessionData.audio_urls) {
        for (const [lang, audioFile] of Object.entries(
          sessionData.audio_urls
        )) {
          if (audioFile && audioFile instanceof File) {
            const audioUrl = await uploadFileToCloudflare(
              audioFile,
              `session-${params.id}-${lang}-audio`
            );
            updatedSessionData.audio_urls[lang] = audioUrl;
          } else if (shouldConvertToCDN(audioFile)) {
            // Convert non-CDN URLs to CDN format by prefixing
            updatedSessionData.audio_urls[lang] = `https://cdn.subconsciousvalley.workers.dev/${audioFile.split('/').pop()}`;
          }
        }
      }

      // Upload child session audio files and materials if they are files
      if (sessionData.child_sessions) {
        for (let i = 0; i < sessionData.child_sessions.length; i++) {
          const child = sessionData.child_sessions[i];

          // Upload audio files or convert URLs to CDN
          if (child.audio_urls) {
            for (const [lang, audioFile] of Object.entries(child.audio_urls)) {
              if (audioFile && audioFile instanceof File) {
                const audioUrl = await uploadFileToCloudflare(
                  audioFile,
                  `session-${params.id}-child-${i}-${lang}-audio`
                );
                updatedSessionData.child_sessions[i].audio_urls[lang] =
                  audioUrl;
              } else if (shouldConvertToCDN(audioFile)) {
                // Convert non-CDN URLs to CDN format
                updatedSessionData.child_sessions[i].audio_urls[lang] = `https://cdn.subconsciousvalley.workers.dev/${audioFile.split('/').pop()}`;
              }
            }
          }

          // Upload material files or convert URLs to CDN
          if (child.materials) {
            for (let j = 0; j < child.materials.length; j++) {
              const material = child.materials[j];
              if (material.link && material.link instanceof File) {
                const materialUrl = await uploadFileToCloudflare(
                  material.link,
                  `session-${params.id}-child-${i}-material-${j}`
                );
                updatedSessionData.child_sessions[i].materials[j].link =
                  materialUrl;
              } else if (shouldConvertToCDN(material.link)) {
                // Convert non-CDN URLs to CDN format
                updatedSessionData.child_sessions[i].materials[j].link = `https://cdn.subconsciousvalley.workers.dev/${material.link.split('/').pop()}`;
              }
            }
          }
        }
      }

      const response = await fetch(`/api/sessions/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSessionData),
      });

      if (response.ok) {
        router.push("/sessions");
      } else {
        alert("Failed to update session");
      }
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Error saving session");
    }
    setIsSaving(false);
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8 ${
            sessionData.child_sessions && sessionData.child_sessions.length > 0
              ? "mx-8 xl:mx-16"
              : ""
          }`}
        >
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
                  Edit Session
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your session content and settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div
            className={`space-y-8 ${
              sessionData.child_sessions &&
              sessionData.child_sessions.length > 0
                ? "lg:col-span-3 px-8 xl:px-16"
                : "lg:col-span-2"
            }`}
          >
            {/* Basic Information */}
            <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className=" w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    Basic Information
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700"
                    >
                      Session Title *
                    </Label>
                    <Input
                      id="title"
                      value={sessionData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                      placeholder="Enter session title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-700"
                    >
                      Category
                    </Label>
                    <Select
                      value={sessionData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
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
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={sessionData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg resize-none"
                    placeholder="Describe your session..."
                  />
                </div>

                {(!sessionData.child_sessions ||
                  sessionData.child_sessions.length === 0) && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="materials"
                      className="text-sm font-medium text-gray-700"
                    >
                      Materials
                    </Label>
                    <Textarea
                      id="materials"
                      value={sessionData.materials || ""}
                      onChange={(e) =>
                        handleInputChange("materials", e.target.value)
                      }
                      rows={3}
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg resize-none"
                      placeholder="List any materials or resources needed for this session..."
                    />
                  </div>
                )}
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
                    <Label
                      htmlFor="price"
                      className="text-sm font-medium text-gray-700"
                    >
                      Current Price (AED)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={sessionData.price}
                      onChange={(e) =>
                        handleInputChange("price", Number(e.target.value))
                      }
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="original_price"
                      className="text-sm font-medium text-gray-700"
                    >
                      Original Price (AED)
                    </Label>
                    <Input
                      id="original_price"
                      type="number"
                      value={sessionData.original_price}
                      onChange={(e) =>
                        handleInputChange(
                          "original_price",
                          Number(e.target.value)
                        )
                      }
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="discount"
                      className="text-sm font-medium text-gray-700"
                    >
                      Discount %
                    </Label>
                    <Input
                      id="discount"
                      type="number"
                      value={sessionData.discount_percentage}
                      onChange={(e) =>
                        handleInputChange(
                          "discount_percentage",
                          Number(e.target.value)
                        )
                      }
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
                    value={sessionData.image_url}
                    onChange={(value) => handleInputChange("image_url", value)}
                    accept="image/*"
                    placeholder="Upload session image"
                  />
                </div>

                {(!sessionData.child_sessions ||
                  sessionData.child_sessions.length === 0) && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="duration"
                      className="text-sm font-medium text-gray-700"
                    >
                      Duration (minutes)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={sessionData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", Number(e.target.value))
                      }
                      className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg h-11"
                      placeholder="25"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="is_sample"
                    checked={sessionData.is_sample}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_sample", checked)
                    }
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 data-[state=checked]:text-white [&>span>svg]:text-white"
                  />
                  <Label
                    htmlFor="is_sample"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as Sample Session
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Audio Files */}
            {(!sessionData.child_sessions ||
              sessionData.child_sessions.length === 0) && (
              <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    Audio Files
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        English Audio
                      </Label>
                      <FileUpload
                        value={sessionData.audio_urls?.english || ""}
                        onChange={(value) =>
                          handleAudioUrlChange("english", value)
                        }
                        accept="audio/*"
                        placeholder="Upload English audio file"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Hindi Audio
                      </Label>
                      <FileUpload
                        value={sessionData.audio_urls?.hindi || ""}
                        onChange={(value) =>
                          handleAudioUrlChange("hindi", value)
                        }
                        accept="audio/*"
                        placeholder="Upload Hindi audio file"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Arabic Audio
                      </Label>
                      <FileUpload
                        value={sessionData.audio_urls?.arabic || ""}
                        onChange={(value) =>
                          handleAudioUrlChange("arabic", value)
                        }
                        accept="audio/*"
                        placeholder="Upload Arabic audio file"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Child Sessions */}
            {sessionData.child_sessions &&
              sessionData.child_sessions.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                        <div className="w-3 h-3 bg-violet-500 rounded-full mr-3"></div>
                        Child Sessions ({sessionData.child_sessions.length})
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
                      {sessionData.child_sessions?.map((child, index) => (
                        <AccordionItem
                          key={index}
                          value={`session-${index}`}
                          className="border border-black rounded-lg"
                          ref={(el) => (childSessionRefs.current[index] = el)}
                        >
                          <div className="flex items-center">
                            <AccordionTrigger className="flex-1 px-4 py-3 hover:no-underline cursor-pointer">
                              <span className="font-semibold text-slate-800">
                                Session {index + 1}: {child.title || "Untitled"}
                              </span>
                            </AccordionTrigger>
                            <Button
                              type="button"
                              onClick={() => removeChildSession(index)}
                              variant="destructive"
                              size="sm"
                              className="hover:bg-red-600 mr-4"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <AccordionContent className="px-4 pb-4 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  Title
                                </Label>
                                <Input
                                  value={child.title || ""}
                                  onChange={(e) =>
                                    handleChildSessionChange(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg"
                                  placeholder="Enter session title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                  Duration (minutes)
                                </Label>
                                <Input
                                  type="number"
                                  value={child.duration || 25}
                                  onChange={(e) =>
                                    handleChildSessionChange(
                                      index,
                                      "duration",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg"
                                  placeholder="25"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
                                Description
                              </Label>
                              <Textarea
                                value={child.description || ""}
                                onChange={(e) =>
                                  handleChildSessionChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={3}
                                className="border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg resize-none"
                                placeholder="Describe this session..."
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-sm font-medium text-gray-700">
                                Materials
                              </Label>
                              <div className="p-4 rounded-lg border border-black space-y-3">
                                {(child.materials || []).map(
                                  (material, materialIndex) => (
                                    <div
                                      key={materialIndex}
                                      className="p-3 bg-white rounded-lg  border-black space-y-3"
                                    >
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-sm font-medium text-gray-700">
                                          Material {materialIndex + 1}
                                        </h5>
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            removeChildMaterial(
                                              index,
                                              materialIndex
                                            )
                                          }
                                          variant="destructive"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <div>
                                        <Label className="text-xs font-medium text-gray-600">
                                          Name
                                        </Label>
                                        <Input
                                          value={material.name || ""}
                                          onChange={(e) =>
                                            handleChildMaterialChange(
                                              index,
                                              materialIndex,
                                              "name",
                                              e.target.value
                                            )
                                          }
                                          className="mt-1"
                                          placeholder="Material name"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs font-medium text-gray-600">
                                          Material File
                                        </Label>
                                        <FileUpload
                                          value={material.link || ""}
                                          onChange={(value) =>
                                            handleChildMaterialChange(
                                              index,
                                              materialIndex,
                                              "link",
                                              value
                                            )
                                          }
                                          accept=".pdf,.doc,.docx,.txt"
                                          placeholder="Upload material file"
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                                <Button
                                  type="button"
                                  onClick={() => addChildMaterial(index)}
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-3"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Material
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <Label className="text-sm font-medium text-gray-700">
                                Audio Files
                              </Label>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-gray-600">
                                    English Audio
                                  </Label>
                                  <FileUpload
                                    value={child.audio_urls?.english || ""}
                                    onChange={(value) =>
                                      handleChildAudioChange(
                                        index,
                                        "english",
                                        value
                                      )
                                    }
                                    accept="audio/*"
                                    placeholder="Upload English audio"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-gray-600">
                                    Hindi Audio
                                  </Label>
                                  <FileUpload
                                    value={child.audio_urls?.hindi || ""}
                                    onChange={(value) =>
                                      handleChildAudioChange(
                                        index,
                                        "hindi",
                                        value
                                      )
                                    }
                                    accept="audio/*"
                                    placeholder="Upload Hindi audio"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-gray-600">
                                    Arabic Audio
                                  </Label>
                                  <FileUpload
                                    value={child.audio_urls?.arabic || ""}
                                    onChange={(value) =>
                                      handleChildAudioChange(
                                        index,
                                        "arabic",
                                        value
                                      )
                                    }
                                    accept="audio/*"
                                    placeholder="Upload Arabic audio"
                                  />
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

            {/* Add Child Session Button */}
            {(!sessionData.child_sessions ||
              sessionData.child_sessions.length === 0) && (
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
          {(!sessionData.child_sessions ||
            sessionData.child_sessions.length === 0) && (
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
                    {availableLanguages.map((lang) => (
                      <div
                        key={lang.value}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={lang.value}
                          checked={sessionData.languages.includes(lang.value)}
                          onCheckedChange={() =>
                            handleLanguageToggle(lang.value)
                          }
                          className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 data-[state=checked]:text-white [&>span>svg]:text-white"
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
          )}
        </div>

        {/* Save Actions */}
        <div
          className={`mt-8 ${
            sessionData.child_sessions && sessionData.child_sessions.length > 0
              ? "mx-8 xl:mx-16"
              : ""
          }`}
        >
          <Card className="bg-white/90 backdrop-blur-lg border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/sessions")}
                  className="border-gray-200 hover:bg-gray-50 px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
