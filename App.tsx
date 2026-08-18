import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Lightbulb,
  Film,
  MessageSquare,
  Image as ImageIcon,
  RefreshCw,
  Copy,
  Check,
  Download,
  Send,
  Sparkles,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { InputPanel } from "./components/InputPanel";
import { UniqueAdConceptView } from "./components/UniqueAdConceptView";
import { UniqueAdScriptView } from "./components/UniqueAdScriptView";
import { UniqueAdCaptionView } from "./components/UniqueAdCaptionView";
import { UniqueAdCopyView } from "./components/UniqueAdCopyView";
import { ExportModal } from "./components/ExportModal";
import {
  AdConceptData,
  AngleStyleOption,
  ToneOption,
} from "./types";

export default function App() {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [inputText, setInputText] = useState("");
  const [fileData, setFileData] = useState<{
    mimeType: string;
    base64: string;
    fileName: string;
  } | null>(null);
  const [angleStyle, setAngleStyle] = useState<AngleStyleOption>("curiosity");
  const [tone, setTone] = useState<ToneOption>("natural");
  const [targetLanguage, setTargetLanguage] = useState<"auto" | "bn" | "en">("auto");

  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineInput, setRefineInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const [adData, setAdData] = useState<AdConceptData | null>(null);
  const [activeTab, setActiveTab] = useState<"concept" | "script" | "caption" | "copy">("concept");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim() && !fileData) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          fileData,
          targetLanguage,
          angleStyle,
          tone,
          variationSeed: `seed_${Date.now()}_${Math.random()}`,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || "Failed to generate ad concept.");
      }

      setAdData(resJson.data);
      setActiveTab("concept");

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#4f46e5", "#10b981", "#f59e0b"],
      });
    } catch (err: any) {
      console.error("Generation error:", err);
      let msg = err.message || "অ্যাড জেনারেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adData || !refineInput.trim() || isRefining) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/refine-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAd: adData,
          instruction: refineInput,
          targetLanguage,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || "Failed to refine ad concept.");
      }

      setAdData(resJson.data);
      setRefineInput("");
    } catch (err: any) {
      console.error("Refinement error:", err);
      setErrorMessage(err.message || "অ্যাড পরিবর্তন করতে সমস্যা হয়েছে।");
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopyEverything = () => {
    if (!adData) return;
    const textToCopy = `=====================================================
অ্যাড ক্যাম্পেইন: ${adData.productSummary.productName}
=====================================================

[১] ইউনিক অ্যাড কনসেপ্ট (Unique Ad Concept)
-----------------------------------------------------
• আইডিয়া: ${adData.uniqueAdConcept.idea.concept}
• ইউনিক অ্যাঙ্গেল: ${adData.uniqueAdConcept.idea.uniqueAngle}
• কাস্টমার অবতার: ${adData.uniqueAdConcept.customerAvatar.avatarName} (${adData.uniqueAdConcept.customerAvatar.targetAgeAndType})
• সাইকোলজি: ${adData.uniqueAdConcept.customerAvatar.psychology}
• কেনার কারণ: ${adData.uniqueAdConcept.customerAvatar.buyingTrigger}
• মূল সমস্যা (Core Pain): ${adData.uniqueAdConcept.painsGenerator.corePain}
• প্রতিদিনের সমস্যা:
${adData.uniqueAdConcept.painsGenerator.hiddenFrustrations.map((f) => `  - ${f}`).join("\n")}
• সমাধান না করার ক্ষতি: ${adData.uniqueAdConcept.painsGenerator.emotionalCost}

[২] ইউনিক অ্যাড স্ক্রিপ্ট (Unique Ad Script)
-----------------------------------------------------
• হুক (০:০০-০:০৩s): "${adData.uniqueAdScript.hook.hookText}"
• পেইন পয়েন্ট: ${adData.uniqueAdScript.painPoint.painPointDialogue}
• সমাধান: ${adData.uniqueAdScript.solution.solutionDialogue}
• CTA: "${adData.uniqueAdScript.solution.callToAction}"
-----------------------------------------------------
রেকর্ডিং স্ক্রিপ্ট:
${adData.uniqueAdScript.fullFormattedScript}

[৩] ইউনিক অ্যাড ক্যাপশন (Unique Ad Caption)
-----------------------------------------------------
• টাইটেল: ${adData.uniqueAdCaption.title}
• পেইন পয়েন্ট: ${adData.uniqueAdCaption.painPoint}
• ব্র্যান্ডওয়াইজ সমাধান: ${adData.uniqueAdCaption.brandwiseSolution.solutionText}
• অফার: ${adData.uniqueAdCaption.brandwiseSolution.offerAndGuarantee}
• অ্যাকশন: ${adData.uniqueAdCaption.brandwiseSolution.callToAction}

[৪] ইউনিক অ্যাড কপি / ইমেজ অ্যাড (Unique Ad Copy)
-----------------------------------------------------
• হেডলাইন: ${adData.uniqueAdCopy.imageContent.headline}
• সাব-হেডলাইন: ${adData.uniqueAdCopy.imageContent.subHeadline}
• ব্যাজ/অফার: ${adData.uniqueAdCopy.imageContent.badgeText || "N/A"}
• বাটন: ${adData.uniqueAdCopy.imageContent.callToActionText}

AI IMAGE PROMPT:
${adData.uniqueAdCopy.imagePrompt.aiPrompt}
=====================================================`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleTryNextAngle = () => {
    const angles: AngleStyleOption[] = [
      "curiosity",
      "pain-agitate",
      "direct-offer",
      "story",
      "transformation",
    ];
    const currentIndex = angles.indexOf(angleStyle);
    const nextAngle = angles[(currentIndex + 1) % angles.length];
    setAngleStyle(nextAngle);
    handleGenerate();
  };

  const handleReset = () => {
    setAdData(null);
    setInputText("");
    setFileData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onReset={handleReset}
        hasResult={!!adData}
      />

      {/* Main Center Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between shadow-xs">
            <span className="font-semibold">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900 font-bold px-2 py-1 text-xs"
            >
              {lang === "bn" ? "মুছে ফেলুন" : "Dismiss"}
            </button>
          </div>
        )}

        {/* Input Panel with Option A (Text) and Option B (Drag & Drop File) */}
        <InputPanel
          lang={lang}
          inputText={inputText}
          setInputText={setInputText}
          fileData={fileData}
          setFileData={setFileData}
          angleStyle={angleStyle}
          setAngleStyle={setAngleStyle}
          tone={tone}
          setTone={setTone}
          targetLanguage={targetLanguage}
          setTargetLanguage={setTargetLanguage}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {/* Results Area with 4 Core Modules */}
        {adData && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-300">
            {/* Top Bar for Results */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {lang === "bn" ? "অ্যাড তৈরি সম্পন্ন" : "Ad Created"}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {adData.productSummary.productName}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 1-Click Copy All */}
                <button
                  onClick={handleCopyEverything}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{lang === "bn" ? "সব কপি হয়েছে!" : "All Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{lang === "bn" ? "সম্পূর্ণ কপি করুন" : "Copy Everything"}</span>
                    </>
                  )}
                </button>

                {/* Try Different Style */}
                <button
                  onClick={handleTryNextAngle}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? "animate-spin" : ""}`} />
                  <span>{lang === "bn" ? "অন্য অ্যাঙ্গেল" : "Different Angle"}</span>
                </button>

                {/* Export Modal Button */}
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                  title="Export"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* The 4 Modules Tabs Requested by User */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl">
              {[
                {
                  id: "concept",
                  labelBn: "১. ইউনিক কনসেপ্ট",
                  labelEn: "1. Unique Concept",
                  icon: Lightbulb,
                },
                {
                  id: "script",
                  labelBn: "২. ইউনিক স্ক্রিপ্ট",
                  labelEn: "2. Unique Script",
                  icon: Film,
                },
                {
                  id: "caption",
                  labelBn: "৩. ইউনিক ক্যাপশন",
                  labelEn: "3. Unique Caption",
                  icon: MessageSquare,
                },
                {
                  id: "copy",
                  labelBn: "৪. ইউনিক অ্যাড কপি",
                  labelEn: "4. Unique Ad Copy",
                  icon: ImageIcon,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{lang === "bn" ? tab.labelBn : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab View for the 4 Modules */}
            <div>
              {activeTab === "concept" && (
                <UniqueAdConceptView concept={adData.uniqueAdConcept} lang={lang} />
              )}

              {activeTab === "script" && (
                <UniqueAdScriptView script={adData.uniqueAdScript} lang={lang} />
              )}

              {activeTab === "caption" && (
                <UniqueAdCaptionView caption={adData.uniqueAdCaption} lang={lang} />
              )}

              {activeTab === "copy" && (
                <UniqueAdCopyView adCopy={adData.uniqueAdCopy} lang={lang} />
              )}
            </div>

            {/* Simple Refinement Form */}
            <form
              onSubmit={handleRefine}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-2"
            >
              <input
                type="text"
                value={refineInput}
                onChange={(e) => setRefineInput(e.target.value)}
                placeholder={
                  lang === "bn"
                    ? "কোনো পরিবর্তন চান? লিখুন (যেমন: স্ক্রিপ্টের হুকটি আরো রোমাঞ্চকর করুন)..."
                    : "Want any changes? Type here (e.g. make the hook more thrilling)..."
                }
                className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                disabled={isRefining || !refineInput.trim()}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  isRefining || !refineInput.trim()
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs"
                }`}
              >
                {isRefining ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {lang === "bn" ? "পরিবর্তন করুন" : "Refine"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Clean Simple Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 mt-auto">
        <p>AdCraft AI • ইউনিক অ্যাড কপিরাইটার ও কনসেপ্ট স্টুডিও</p>
      </footer>

      {/* Export Modal */}
      {adData && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          adData={adData}
          lang={lang}
        />
      )}
    </div>
  );
}
