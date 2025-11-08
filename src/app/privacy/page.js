"use client";
import { useLanguage } from "@/components/LanguageProvider";

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            {t("privacy_page_title")}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 mb-8">
              {t("privacy_intro_text")}
            </p>
            
            <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">{t("privacy_policy_section")}</h2>
            <div className="text-slate-700 leading-relaxed space-y-4">
              <p><strong>{t("info_collect_label")}</strong> {t("info_collect_text")}</p>
              <p><strong>{t("info_use_label")}</strong> {t("info_use_text")}</p>
              <p><strong>{t("data_protection_label")}</strong> {t("data_protection_text")}</p>
              <p><strong>{t("cookies_label")}</strong> {t("cookies_text")}</p>
              <p><strong>{t("your_rights_label")}</strong> {t("your_rights_text")}</p>
              <p><strong>{t("children_label")}</strong> {t("children_text")}</p>
            </div>
            
            <div className="mt-12 p-6 bg-teal-50 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{t("got_questions")}</h3>
              <p className="text-slate-700 mb-4">{t("drop_email")}</p>
              <a href="mailto:hello@subconsciousvalley.com" className="text-teal-600 hover:text-teal-700 font-semibold">
                hello@subconsciousvalley.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}