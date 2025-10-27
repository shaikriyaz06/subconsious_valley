"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Brain,
  Globe,
  Star,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: t("value_1_title"),
      description: t("value_1_desc"),
    },
    {
      icon: Brain,
      title: t("value_2_title"),
      description: t("value_2_desc"),
    },
    {
      icon: Globe,
      title: t("value_3_title"),
      description: t("value_3_desc"),
    },
    {
      icon: Star,
      title: t("value_4_title"),
      description: t("value_4_desc"),
    },
  ];

  const credentials = [
    "Certified NLP Practitioner",
    "Licensed Hypnotherapy Specialist",
    "Trauma-Informed Therapy Training",
    "Multilingual Therapeutic Communication",
    "Mind-Body Wellness Certification",
    "Advanced Subconscious Reprogramming",
  ];

  const journey = [
    {
      year: "2017",
      title: t("journey_1_title"),
      description: t("journey_1_desc"),
    },
    {
      year: "2019",
      title: t("journey_2_title"),
      description: t("journey_2_desc"),
    },
    {
      year: "2023",
      title: t("journey_3_title"),
      description: t("journey_3_desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-teal-100 text-teal-800 mb-6">
                {t("about")}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("about_hero_title")}
                </span>
                <br />
                <span className="text-slate-800">
                  {t("about_hero_title_2")}
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t("about_hero_desc")}
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                >
                  {t("start_your_transformation")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="/images/founderImage.jpg"
                  alt="Vanita Pande - Founder"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                  <p className="text-sm font-semibold text-slate-800">
                    Founded 2023
                  </p>
                  <p className="text-xs text-slate-500">Dubai, UAE</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder's Story */}
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
              {t("story_behind_title")}
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              {t("story_behind_desc")}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="prose prose-lg max-w-none">
                <div className="bg-teal-50 p-8 rounded-2xl border-l-4 border-teal-500 mb-8">
                  <p className="text-lg text-slate-700 italic leading-relaxed mb-0">
                    "{t("founder_about_quote")}"
                  </p>
                  <p className="text-right mt-4 font-semibold text-teal-700">
                    — Vanita Pande
                  </p>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-slate-800">
                  {t("why_multilingual_matters")}
                </h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {t("why_multilingual_p1")}
                </p>

                <p className="text-slate-700 mb-6 leading-relaxed">
                  {t("why_multilingual_p2")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Vanita Pande
                    </h3>
                    <p className="text-slate-600">{t("founder_title")}</p>
                  </div>

                  <h4 className="font-semibold text-slate-800 mb-3">
                    {t("certifications_training")}
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {credentials.map((credential) => (
                      <li key={credential} className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 mr-2 shrink-0" />
                        <span className="text-sm text-slate-700">
                          {credential}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 rounded-lg text-white text-center">
                    <p className="font-semibold">
                      500+ {t("lives_transformed")}
                    </p>
                    <p className="text-sm text-teal-100">
                      {t("across_countries")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0">
                <CardContent className="p-6">
                  <h4 className="font-bold text-slate-800 mb-4">
                    {t("languages_we_heal_in")}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["English", "हिंदी", "العربية"].map((lang) => (
                      <Badge
                        key={lang}
                        className="justify-center bg-white/80 text-slate-700"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  {/* <div className="mt-3 text-center">
                    <Badge variant="outline" className="text-slate-600">
                      {t("many_more")}
                    </Badge>
                  </div> */}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Co-Founder Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="/images/coFounderImage.jpg"
                  alt="Sara - Co-Founder"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                  <p className="text-sm font-semibold text-slate-800">
                    Co-Founder
                  </p>
                  <p className="text-xs text-slate-500">Age 15</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-purple-100 text-purple-800 mb-6">
                {t("co_founder")}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t("meet_cofounder")}
                </span>
                <br />
                <span className="text-slate-800">{t("young_visionary")}</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t("about_cofounder")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-purple-500 text-white">
                  Access Bars Practitioner
                </Badge>
                <Badge className="bg-pink-500 text-white">Energy Healing</Badge>
                <Badge className="bg-violet-500 text-white">
                  Audio Content Creator
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
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
              {t("our_core_values")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t("core_values_desc")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
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
              {t("our_journey")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t("our_journey_desc")}
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-teal-200 to-emerald-200"></div>

            <div className="space-y-12">
              {journey.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`lg:w-1/2 ${
                      index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"
                    }`}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6">
                        <Badge className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white mb-4">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-bold mb-3 text-slate-800">
                          {milestone.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full border-4 border-white shadow-lg"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-teal-500 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 text-white">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">{t("our_mission")}</h3>
                <p className="text-teal-100 text-lg leading-relaxed">
                  {t("our_mission_desc")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">{t("our_vision")}</h3>
                <p className="text-teal-100 text-lg leading-relaxed">
                  {t("our_vision_desc")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: t("lives_transformed") },
              { number: "6+", label: t("all_languages") },
              { number: "15+", label: t("stat_countries") },
              { number: "95%", label: t("stat_success") },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </p>
                  <p className="text-slate-600 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-800">
              {t("ready_to_begin")}
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              {t("ready_to_begin_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/session">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                >
                  {t("explore_collection")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal-200 hover:bg-teal-50"
                >
                  {t("get_in_touch")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
