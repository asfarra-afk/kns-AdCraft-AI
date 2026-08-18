import React, { useState } from "react";
import { Copy, Check, Lightbulb, Users, AlertTriangle, Sparkles } from "lucide-react";
import { UniqueAdConcept } from "../types";

interface UniqueAdConceptViewProps {
  concept: UniqueAdConcept;
  lang: "bn" | "en";
}

export const UniqueAdConceptView: React.FC<UniqueAdConceptViewProps> = ({
  concept,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `💡 ১. ইউনিক আইডিয়া ও অ্যাঙ্গেল:
• কনসেপ্ট: ${concept.idea.concept}
• ইউনিক অ্যাঙ্গেল: ${concept.idea.uniqueAngle}

👤 ২. কাস্টমার অবতার (টার্গেট অডিয়েন্স):
• প্রোফাইল: ${concept.customerAvatar.avatarName} (${concept.customerAvatar.targetAgeAndType})
• সাইকোলজি ও মানসিক অবস্থা: ${concept.customerAvatar.psychology}
• কেনার মূল কারণ (Buying Trigger): ${concept.customerAvatar.buyingTrigger}

🔥 ৩. পেইন জেনারেটর (আসল সমস্যা ও ফ্রাস্ট্রেশন):
• মূল সমস্যা: ${concept.painsGenerator.corePain}
• প্রতিদিনের লুকায়িত সমস্যা:
${concept.painsGenerator.hiddenFrustrations.map((p) => `  - ${p}`).join("\n")}
• সমাধান না করার ক্ষতি: ${concept.painsGenerator.emotionalCost}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            Module 1
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            {lang === "bn" ? "ইউনিক অ্যাড কনসেপ্ট (Unique Ad Concept)" : "Unique Ad Concept"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "bn"
              ? "আইডিয়া, কাস্টমার অবতার ও পেইন জেনারেটর"
              : "Idea, Customer Avatar & Pains Generator"}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer self-start sm:self-center"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{lang === "bn" ? "কনসেপ্ট কপিড!" : "Concept Copied!"}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{lang === "bn" ? "সম্পূর্ণ কনসেপ্ট কপি করুন" : "Copy Full Concept"}</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Core Cards: Idea, Customer Avatar, Pains Generator */}
      <div className="space-y-4">
        {/* 1. Idea Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900">
              {lang === "bn" ? "১. আইডিয়া ও ইউনিক অ্যাঙ্গেল (Idea & Angle)" : "1. Idea & Unique Angle"}
            </h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-0.5">
                {lang === "bn" ? "মূল কনসেপ্ট:" : "Main Concept:"}
              </span>
              <p className="text-slate-900 font-semibold leading-relaxed">
                {concept.idea.concept}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-200/80">
              <span className="text-xs font-bold text-indigo-600 block mb-0.5">
                ✨ {lang === "bn" ? "কেন এটি ইউনিক ও আলাদা:" : "Why it's Unique:"}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {concept.idea.uniqueAngle}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Customer Avatar Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900">
              {lang === "bn" ? "২. কাস্টমার অবতার (Customer Avatar)" : "2. Customer Avatar"}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white rounded-lg p-3 border border-slate-200/80">
              <span className="font-bold text-slate-500 block mb-1">
                {lang === "bn" ? "টার্গেট কাস্টমার প্রোফাইল:" : "Target Customer Profile:"}
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {concept.customerAvatar.avatarName}
              </p>
              <p className="text-slate-600 mt-1">
                {concept.customerAvatar.targetAgeAndType}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-slate-200/80">
              <span className="font-bold text-indigo-600 block mb-1">
                🎯 {lang === "bn" ? "কেনার মূল ট্রিগার (Buying Trigger):" : "Buying Trigger:"}
              </span>
              <p className="text-slate-800 font-semibold leading-relaxed">
                {concept.customerAvatar.buyingTrigger}
              </p>
            </div>

            <div className="md:col-span-2 bg-white rounded-lg p-3 border border-slate-200/80">
              <span className="font-bold text-slate-500 block mb-1">
                🧠 {lang === "bn" ? "কাস্টমার সাইকোলজি ও মানসিক স্ট্রাগল:" : "Psychology & Subconscious Struggles:"}
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {concept.customerAvatar.psychology}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Pains Generator Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900">
              {lang === "bn" ? "৩. পেইন জেনারেটর (Pains Generator)" : "3. Pains Generator"}
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-white rounded-lg p-3 border border-slate-200/80">
              <span className="font-bold text-rose-700 block mb-1">
                🔥 {lang === "bn" ? "কাস্টমারের গভীর মূল সমস্যা (Core Pain):" : "Core Pain Point:"}
              </span>
              <p className="text-slate-900 text-sm font-bold leading-relaxed">
                {concept.painsGenerator.corePain}
              </p>
            </div>

            {concept.painsGenerator.hiddenFrustrations && concept.painsGenerator.hiddenFrustrations.length > 0 && (
              <div className="bg-white rounded-lg p-3 border border-slate-200/80">
                <span className="font-bold text-slate-600 block mb-1.5">
                  ⚠️ {lang === "bn" ? "প্রতিদিনের লুকায়িত বিরক্তি ও সমস্যা:" : "Daily Hidden Frustrations:"}
                </span>
                <ul className="space-y-1.5">
                  {concept.painsGenerator.hiddenFrustrations.map((frust, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-800">
                      <span className="text-rose-500 font-bold">•</span>
                      <span className="leading-relaxed font-medium">{frust}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-rose-50/60 rounded-lg p-3 border border-rose-200">
              <span className="font-bold text-rose-900 block mb-0.5">
                ⏳ {lang === "bn" ? "সমাধান না করার মানসিক ও আর্থিক ক্ষতি:" : "Emotional/Financial Cost of Inaction:"}
              </span>
              <p className="text-rose-950 font-medium leading-relaxed">
                {concept.painsGenerator.emotionalCost}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
