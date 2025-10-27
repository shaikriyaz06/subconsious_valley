"use client";
import React, { useState } from "react";
// import { Contact as ContactEntity, SiteSettings } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Send, Instagram, Youtube } from "lucide-react"; // Removed Phone, MessageCircle
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
// import { SendEmail } from "@/api/integrations";

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // phone: "", // Removed phone field
    subject: "",
    message: "",
    preferred_language: "english",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // await ContactEntity.create(formData);

      // Send email notification
      // const settingsList = await SiteSettings.list();
      const supportEmail = "";
      // settingsList.length > 0
      //   ? settingsList[0].support_email
      //   : "hello@subconsciousvalley.com";

      const emailBody = `
        New message from Subconscious Valley contact form:
        -------------------------------------------------
        Name: ${formData.name}
        Email: ${formData.email}
        Preferred Language: ${formData.preferred_language}
        Subject: ${formData.subject}
        -------------------------------------------------
        Message:
        ${formData.message}
      `;

      // await SendEmail({
      //   to: supportEmail,
      //   subject: `New Contact Form Submission: ${formData.subject}`,
      //   body: emailBody,
      //   from_name: "Subconscious Valley"
      // });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        // phone: "", // Removed phone field
        subject: "",
        message: "",
        preferred_language: "english",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }

    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t("visit_us"),
      details: [
        "Office 302, Shubbar Majed Building",
        "Mankhool, Bur Dubai, Dubai, UAE",
      ],
      color: "text-teal-600",
    },
    {
      icon: Mail,
      title: t("email_us"),
      details: ["hello@subconsciousvalley.com", "We reply within 24 hours"],
      color: "text-blue-600",
    },
    // Removed WhatsApp contact info
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">
            {t("message_sent")}
          </h2>
          <p className="text-slate-600 mb-6">{t("message_sent_desc")}</p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
          >
            {t("send_another")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              {t("contact_title")}
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t("contact_desc")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-8 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-start space-x-4"
                >
                  <div
                    className={`p-3 rounded-xl bg-white shadow-md ${info.color}`}
                  >
                    <info.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {info.title}
                    </h3>
                    {info.details.map((detail, i) => (
                      <p
                        key={i}
                        className={`text-slate-600 ${
                          i === 0 ? "font-medium" : ""
                        }`}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {t("follow_us")}
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/subconsciousvalley/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.youtube.com/@SubconsciousValley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Youtube className="h-6 w-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@subconciousvalley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.5z"/>
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl h-64 flex items-center justify-center"
            >
              <div className="text-center">
                <MapPin className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <p className="text-teal-800 font-medium">Dubai, UAE</p>
                <p className="text-teal-600">{t("map_soon")}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {t("send_us_message")}
                </CardTitle>
                <p className="text-slate-600">{t("contact_form_desc")}</p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t("full_name")} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("email_address")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Phone input section removed */}
                  <div className="grid md:grid-cols-1 gap-4">
                    {" "}
                    {/* Adjusted grid to 1 column for language select */}
                    <div>
                      <Label htmlFor="language">{t("pref_language")}</Label>
                      <Select
                        value={formData.preferred_language}
                        onValueChange={(value) =>
                          handleInputChange("preferred_language", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">हिंदी</SelectItem>
                          <SelectItem value="arabic">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">{t("subject")} *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">{t("message")} *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      required
                      rows={5}
                      className="mt-1"
                      placeholder={t("message_placeholder")}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white h-12"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t("sending")}...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("send_message")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
