import React, { useState } from "react";
import { Copy, Check, Image as ImageIcon, Sparkles, Wand2, Paintbrush, Layers } from "lucide-react";
import { UniqueAdCopy } from "../types";

interface UniqueAdCopyViewProps {
  adCopy: UniqueAdCopy;
  lang: "bn" | "en";
}

export const UniqueAdCopyView: React.FC<UniqueAdCopyViewProps> = ({
  adCopy,
  lang,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyAll = () => {
    const text = `🖼️ ইমেজ অ্যাড কপি (Image Content):
--------------------------------------------------
• ব্যাজ/অফার: ${adCopy.imageContent.badgeText || "N/A"}
• প্রধান হেডলাইন: ${adCopy.imageContent.headline}
• সাব-হেডলাইন: ${adCopy.imageContent.subHeadline}
• মূল সুবিধা (Bullet Points):
${adCopy.imageContent.bulletPoints.map((b) => `  - ${b}`).join("\n")}
• বাটন (CTA): ${adCopy.imageContent.callToActionText}

🎨 ইমেজ প্রম্পট ও ডিজাইন ডিরেকশন (Image Prompt):
--------------------------------------------------
• AI Image Prompt (Midjourney/Gemini):
${adCopy.imagePrompt.aiPrompt}

• ডিজাইনারের জন্য নোট:
${adCopy.imagePrompt.designerNote}`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(adCopy.imagePrompt.aiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            Module 4
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            {lang === "bn" ? "ইউনিক অ্যাড কপি (Unique Ad Copy / Image Ad)" : "Unique Ad Copy"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "bn"
              ? "ইমেজ কনটেন্ট ও ইমেজ প্রম্পট (Image Content & Image Prompt)"
              : "Image Content & AI Image Prompt"}
          </p>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer self-start sm:self-center"
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{lang === "bn" ? "কপি হয়েছে!" : "Copied!"}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{lang === "bn" ? "ইমেজ কপি ও প্রম্পট কপি করুন" : "Copy Image Copy"}</span>
            </>
          )}
        </button>
      </div>

      {/* 2 Core Columns/Blocks: Image Content & Image Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1. Image Content (Left Column) */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900">
              {lang === "bn" ? "১. ইমেজ কনটেন্ট (Image Content)" : "1. Image Content"}
            </h4>
          </div>

          <div className="space-y-3">
            {adCopy.imageContent.badgeText && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {lang === "bn" ? "ব্যাজ / অফার ট্যাগ:" : "Badge / Tag:"}
                </span>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-xs font-black">
                  {adCopy.imageContent.badgeText}
                </span>
              </div>
            )}

            <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                {lang === "bn" ? "ব্যানার হেডলাইন (Headline):" : "Main Banner Headline:"}
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {adCopy.imageContent.headline}
              </p>
            </div>

            <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {lang === "bn" ? "সাব-হেডলাইন (Sub-Headline):" : "Sub-Headline:"}
              </span>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {adCopy.imageContent.subHeadline}
              </p>
            </div>

            {adCopy.imageContent.bulletPoints && adCopy.imageContent.bulletPoints.length > 0 && (
              <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  {lang === "bn" ? "ব্যানারে থাকার মতো মূল সুবিধাসমূহ:" : "Bullet Points for Graphic:"}
                </span>
                <ul className="space-y-1 text-xs font-bold text-slate-800">
                  {adCopy.imageContent.bulletPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-600">✓</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {lang === "bn" ? "ব্যানার বাটন / CTA:" : "Banner Button CTA:"}
              </span>
              <span className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-xs">
                {adCopy.imageContent.callToActionText}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Image Prompt (Right Column) */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Wand2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  {lang === "bn" ? "২. ইমেজ প্রম্পট (Image Prompt)" : "2. AI Image Prompt"}
                </h4>
              </div>

              <button
                onClick={handleCopyAiPrompt}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কপিড!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>প্রম্পট কপি</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Prompt Box */}
            <div className="bg-white rounded-lg p-3.5 border border-purple-200 text-xs font-mono leading-relaxed text-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-purple-700 block mb-1">
                🤖 AI Image Generator Prompt (Midjourney / Gemini):
              </span>
              <p className="whitespace-pre-line select-all">{adCopy.imagePrompt.aiPrompt}</p>
            </div>

            {/* Designer Note */}
            <div className="bg-white rounded-lg p-3.5 border border-slate-200/80 mt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
                <Paintbrush className="w-3.5 h-3.5 text-indigo-600" />
                {lang === "bn" ? "গ্রাফিক ডিজাইনারের জন্য গাইডলাইন:" : "Designer Layout Note:"}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {adCopy.imagePrompt.designerNote}
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/60 rounded-lg p-3 border border-indigo-100 text-[11px] text-indigo-900 font-medium">
            💡 {lang === "bn" ? "উপরের AI প্রম্পটটি সরাসরি Midjourney, Imagen বা Photoshop-এ ব্যবহার করে বাস্তবসম্মত কমার্শিয়াল প্রোডাক্ট ইমেজ জেনারেট করতে পারবেন।" : "Use the AI prompt directly in Midjourney or Imagen to generate realistic commercial photo assets."}
          </div>
        </div>
      </div>
    </div>
  );
};
