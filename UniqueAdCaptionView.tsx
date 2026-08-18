import React, { useState } from "react";
import { Copy, Check, MessageSquare, Tag, Sparkles, ShoppingBag } from "lucide-react";
import { UniqueAdCaption } from "../types";

interface UniqueAdCaptionViewProps {
  caption: UniqueAdCaption;
  lang: "bn" | "en";
}

export const UniqueAdCaptionView: React.FC<UniqueAdCaptionViewProps> = ({
  caption,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const fullPostText = `${caption.fullCaptionFormatted || `${caption.title}\n\n${caption.painPoint}\n\n${caption.brandwiseSolution.solutionText}\n\n🎁 অফার: ${caption.brandwiseSolution.offerAndGuarantee}\n👉 ${caption.brandwiseSolution.callToAction}`}\n\n${caption.hashtags?.join(" ") || ""}`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            Module 3
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            {lang === "bn" ? "ইউনিক অ্যাড ক্যাপশন (Unique Ad Caption)" : "Unique Ad Caption"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "bn"
              ? "টাইটেল, পেইন পয়েন্ট ও ব্র্যান্ডওয়াইজ সমাধান (Title, Pinpoint, Brandwise Solution)"
              : "Title, Pinpoint & Brandwise Solution"}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer self-start sm:self-center"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{lang === "bn" ? "ক্যাপশন কপিড!" : "Caption Copied!"}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{lang === "bn" ? "সম্পূর্ণ ক্যাপশন কপি করুন" : "Copy Caption"}</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Core Blocks: Title, Pinpoint, Brandwise Solution */}
      <div className="space-y-4">
        {/* 1. Title */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
              ১
            </span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "ক্যাপশন টাইটেল / হেডলাইন (Title)" : "Caption Title / Headline"}
            </h4>
          </div>
          <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
            <p className="text-base font-black text-slate-900 leading-snug">
              {caption.title}
            </p>
          </div>
        </div>

        {/* 2. Pinpoint / Problem Breakdown */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-rose-600 text-white text-xs font-black flex items-center justify-center">
              ২
            </span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "পেইন পয়েন্ট ও সমস্যা আলোচনা (Pinpoint)" : "Pinpoint & Story Agitation"}
            </h4>
          </div>
          <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
            <p className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
              {caption.painPoint}
            </p>
          </div>
        </div>

        {/* 3. Brandwise Solution */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
              ৩
            </span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {lang === "bn" ? "ব্র্যান্ডওয়াইজ সমাধান (Brandwise Solution & CTA)" : "Brandwise Solution & Offer"}
            </h4>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
              <span className="text-xs font-bold text-emerald-700 block mb-1">
                ✅ {lang === "bn" ? "ব্র্যান্ডের সুনির্দিষ্ট সমাধান:" : "Brand Solution:"}
              </span>
              <p className="font-semibold text-slate-900 leading-relaxed">
                {caption.brandwiseSolution.solutionText}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-amber-50/70 rounded-lg p-3 border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">
                  🎁 {lang === "bn" ? "বিশেষ অফার ও নিশ্চয়তা:" : "Offer & Guarantee:"}
                </span>
                <p className="font-semibold text-amber-950">
                  {caption.brandwiseSolution.offerAndGuarantee}
                </p>
              </div>

              <div className="bg-indigo-50/70 rounded-lg p-3 border border-indigo-200 text-xs">
                <span className="font-bold text-indigo-900 block mb-0.5">
                  👉 {lang === "bn" ? "কল-টু-অ্যাকশন (CTA):" : "Call to Action:"}
                </span>
                <p className="font-bold text-indigo-950">
                  {caption.brandwiseSolution.callToAction}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Paste Social Post Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                {lang === "bn" ? "সোশ্যাল মিডিয়া রেডি পোস্ট (Facebook & Instagram):" : "Ready-to-Paste Social Post:"}
              </h4>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              {copied ? "কপিড!" : "কপি করুন"}
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200/80 text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-line font-sans font-medium">
            {fullPostText}
          </div>

          {caption.hashtags && caption.hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {caption.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
