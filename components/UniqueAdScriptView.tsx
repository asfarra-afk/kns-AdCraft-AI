import React, { useState } from "react";
import { Copy, Check, Clock, Radio, ShieldAlert, CheckCircle2, Film } from "lucide-react";
import { UniqueAdScript } from "../types";

interface UniqueAdScriptViewProps {
  script: UniqueAdScript;
  lang: "bn" | "en";
}

export const UniqueAdScriptView: React.FC<UniqueAdScriptViewProps> = ({
  script,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `🎬 ${script.title} (~${script.durationSeconds}s)
===================================================

[১] হুক (প্রথম ৩ সেকেন্ড):
"${script.hook.hookText}"
(স্টাইল: ${script.hook.hookStyle} | টিপস: ${script.hook.deliveryTip})

[২] পেইন পয়েন্ট (সমস্যা):
${script.painPoint.painPointDialogue}
(ইমোশনাল ট্রিগার: ${script.painPoint.emotionalTrigger})

[৩] সমাধান ও রূপান্তর:
${script.solution.solutionDialogue}
(রূপান্তর: ${script.solution.transformation})
(কল-টু-অ্যাকশন: "${script.solution.callToAction}")

===================================================
পূর্ণাঙ্গ ডায়ালগ স্ক্রিপ্ট:
===================================================
${script.fullFormattedScript}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              Module 2
            </span>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              ~{script.durationSeconds || 45} {lang === "bn" ? "সেকেন্ড" : "Seconds"}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            {lang === "bn" ? "ইউনিক অ্যাড স্ক্রিপ্ট (Unique Ad Script)" : "Unique Ad Script"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "bn"
              ? "হুক, পেইন পয়েন্ট ও সমাধান (Hook, Pinpoint, Solution)"
              : "Hook, Pinpoint & Solution Structure"}
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer self-start sm:self-center"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{lang === "bn" ? "স্ক্রিপ্ট কপিড!" : "Script Copied!"}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{lang === "bn" ? "সম্পূর্ণ স্ক্রিপ্ট কপি করুন" : "Copy Full Script"}</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Steps: Hook, Pinpoint, Solution */}
      <div className="space-y-4">
        {/* 1. Hook */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                ১
              </span>
              <h4 className="text-sm font-black text-slate-900">
                {lang === "bn" ? "হুক (Hook - প্রথম ৩ সেকেন্ড)" : "Hook (First 3 Seconds)"}
              </h4>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              {script.hook.hookStyle}
            </span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200/80 my-2">
            <p className="text-base font-extrabold text-slate-900 leading-snug">
              "{script.hook.hookText}"
            </p>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-700">🎙️ ডেলিভারি টিপস:</span> {script.hook.deliveryTip}
          </p>
        </div>

        {/* 2. Pinpoint / Pain Point */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-rose-600 text-white text-xs font-black flex items-center justify-center">
              ২
            </span>
            <h4 className="text-sm font-black text-slate-900">
              {lang === "bn" ? "পেইন পয়েন্ট ও সমস্যা (Pinpoint / Pain Point)" : "Pinpoint / Pain Point"}
            </h4>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200/80 my-2">
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              {script.painPoint.painPointDialogue}
            </p>
          </div>

          <p className="text-xs text-rose-700 font-medium">
            <span className="font-bold">🎯 ইমোশনাল ট্রিগার:</span> {script.painPoint.emotionalTrigger}
          </p>
        </div>

        {/* 3. Solution */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
              ৩
            </span>
            <h4 className="text-sm font-black text-slate-900">
              {lang === "bn" ? "সমাধান ও অফার (Solution & Transformation)" : "Solution & Offer"}
            </h4>
          </div>

          <div className="space-y-2">
            <div className="bg-white rounded-lg p-4 border border-slate-200/80">
              <span className="text-xs font-bold text-emerald-700 block mb-1">
                ✨ {lang === "bn" ? "সমাধান ডায়ালগ:" : "Solution Dialogue:"}
              </span>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {script.solution.solutionDialogue}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-lg p-3 border border-slate-200/80">
                <span className="font-bold text-slate-600 block mb-0.5">
                  🌟 {lang === "bn" ? "লাইফ ট্রান্সফরমেশন:" : "Transformation:"}
                </span>
                <p className="text-slate-800 font-semibold">{script.solution.transformation}</p>
              </div>

              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-0.5">
                  ⚡ {lang === "bn" ? "ভিডিও CTA লাইন:" : "Video CTA Line:"}
                </span>
                <p className="text-emerald-950 font-bold">"{script.solution.callToAction}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Dialogue Box */}
        {script.fullFormattedScript && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                {lang === "bn" ? "রেকর্ডিংয়ের জন্য পূর্ণাঙ্গ স্ক্রিপ্ট (Full Flow):" : "Full Script for Recording:"}
              </h4>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans font-medium">
              {script.fullFormattedScript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
