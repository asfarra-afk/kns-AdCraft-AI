import React, { useState } from "react";
import { X, Copy, Check, Download, Printer } from "lucide-react";
import { AdConceptData } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  adData: AdConceptData;
  lang: "bn" | "en";
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  adData,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"formatted" | "markdown">("formatted");

  if (!isOpen) return null;

  const generateFormattedText = () => {
    return `=====================================================
ADCRAFT AI - DIRECT RESPONSE AD CAMPAIGN
=====================================================
PRODUCT: ${adData.productSummary.productName}
TARGET AUDIENCE: ${adData.productSummary.targetAudience}
CORE PROBLEM SOLVED: ${adData.productSummary.coreProblemSolved}

-----------------------------------------------------
[১] ইউনিক অ্যাড কনসেপ্ট (UNIQUE AD CONCEPT)
-----------------------------------------------------
1. IDEA:
• Concept: ${adData.uniqueAdConcept.idea.concept}
• Unique Angle: ${adData.uniqueAdConcept.idea.uniqueAngle}

2. CUSTOMER AVATAR:
• Profile: ${adData.uniqueAdConcept.customerAvatar.avatarName} (${adData.uniqueAdConcept.customerAvatar.targetAgeAndType})
• Psychology: ${adData.uniqueAdConcept.customerAvatar.psychology}
• Buying Trigger: ${adData.uniqueAdConcept.customerAvatar.buyingTrigger}

3. PAINS GENERATOR:
• Core Pain: ${adData.uniqueAdConcept.painsGenerator.corePain}
• Daily Frustrations:
${adData.uniqueAdConcept.painsGenerator.hiddenFrustrations.map((f) => `  - ${f}`).join("\n")}
• Cost of Inaction: ${adData.uniqueAdConcept.painsGenerator.emotionalCost}

-----------------------------------------------------
[২] ইউনিক অ্যাড স্ক্রিপ্ট (UNIQUE AD SCRIPT)
-----------------------------------------------------
1. HOOK:
"${adData.uniqueAdScript.hook.hookText}"
• Style: ${adData.uniqueAdScript.hook.hookStyle} | Delivery: ${adData.uniqueAdScript.hook.deliveryTip}

2. PINPOINT / PAIN POINT:
${adData.uniqueAdScript.painPoint.painPointDialogue}
• Emotional Trigger: ${adData.uniqueAdScript.painPoint.emotionalTrigger}

3. SOLUTION & CTA:
${adData.uniqueAdScript.solution.solutionDialogue}
• Transformation: ${adData.uniqueAdScript.solution.transformation}
• Video CTA: "${adData.uniqueAdScript.solution.callToAction}"

FULL DIALOGUE SCRIPT:
${adData.uniqueAdScript.fullFormattedScript}

-----------------------------------------------------
[৩] ইউনিক অ্যাড ক্যাপশন (UNIQUE AD CAPTION)
-----------------------------------------------------
TITLE:
${adData.uniqueAdCaption.title}

PINPOINT:
${adData.uniqueAdCaption.painPoint}

BRANDWISE SOLUTION:
${adData.uniqueAdCaption.brandwiseSolution.solutionText}
• Offer & Guarantee: ${adData.uniqueAdCaption.brandwiseSolution.offerAndGuarantee}
• CTA: ${adData.uniqueAdCaption.brandwiseSolution.callToAction}

FULL POST:
${adData.uniqueAdCaption.fullCaptionFormatted}
Hashtags: ${adData.uniqueAdCaption.hashtags.join(" ")}

-----------------------------------------------------
[৪] ইউনিক অ্যাড কপি / ইমেজ অ্যাড (UNIQUE AD COPY)
-----------------------------------------------------
IMAGE CONTENT:
• Badge/Offer: ${adData.uniqueAdCopy.imageContent.badgeText || "N/A"}
• Headline: ${adData.uniqueAdCopy.imageContent.headline}
• Sub-Headline: ${adData.uniqueAdCopy.imageContent.subHeadline}
• Bullet Points:
${adData.uniqueAdCopy.imageContent.bulletPoints.map((b) => `  - ${b}`).join("\n")}
• Banner CTA: ${adData.uniqueAdCopy.imageContent.callToActionText}

IMAGE PROMPT (Midjourney / Gemini):
${adData.uniqueAdCopy.imagePrompt.aiPrompt}

DESIGNER NOTE:
${adData.uniqueAdCopy.imagePrompt.designerNote}
=====================================================`;
  };

  const generateMarkdown = () => {
    return `# Ad Campaign: ${adData.productSummary.productName}

**Target Audience:** ${adData.productSummary.targetAudience}  
**Core Problem Solved:** ${adData.productSummary.coreProblemSolved}

---

## 1. Unique Ad Concept
### Idea & Angle
> ${adData.uniqueAdConcept.idea.concept}
- **Unique Angle:** ${adData.uniqueAdConcept.idea.uniqueAngle}

### Customer Avatar
- **Profile:** ${adData.uniqueAdConcept.customerAvatar.avatarName} (${adData.uniqueAdConcept.customerAvatar.targetAgeAndType})
- **Psychology:** ${adData.uniqueAdConcept.customerAvatar.psychology}
- **Buying Trigger:** ${adData.uniqueAdConcept.customerAvatar.buyingTrigger}

### Pains Generator
- **Core Pain:** ${adData.uniqueAdConcept.painsGenerator.corePain}
- **Hidden Frustrations:**
${adData.uniqueAdConcept.painsGenerator.hiddenFrustrations.map((f) => `  - ${f}`).join("\n")}
- **Cost of Inaction:** ${adData.uniqueAdConcept.painsGenerator.emotionalCost}

---

## 2. Unique Ad Script (~${adData.uniqueAdScript.durationSeconds}s)
### Hook
> **"${adData.uniqueAdScript.hook.hookText}"**  
*(${adData.uniqueAdScript.hook.hookStyle} — ${adData.uniqueAdScript.hook.deliveryTip})*

### Pinpoint
${adData.uniqueAdScript.painPoint.painPointDialogue}

### Solution & CTA
${adData.uniqueAdScript.solution.solutionDialogue}  
👉 **CTA:** ${adData.uniqueAdScript.solution.callToAction}

---

## 3. Unique Ad Caption
### Headline
# ${adData.uniqueAdCaption.title}

### Pinpoint
${adData.uniqueAdCaption.painPoint}

### Brandwise Solution & Offer
${adData.uniqueAdCaption.brandwiseSolution.solutionText}  
**Offer:** ${adData.uniqueAdCaption.brandwiseSolution.offerAndGuarantee}  
**Action:** ${adData.uniqueAdCaption.brandwiseSolution.callToAction}

---

## 4. Unique Ad Copy (Image Ad)
- **Headline:** ${adData.uniqueAdCopy.imageContent.headline}
- **Sub-Headline:** ${adData.uniqueAdCopy.imageContent.subHeadline}
- **Button:** ${adData.uniqueAdCopy.imageContent.callToActionText}

### AI Image Generation Prompt
\`\`\`
${adData.uniqueAdCopy.imagePrompt.aiPrompt}
\`\`\`
`;
  };

  const handleCopy = () => {
    const text = activeFormat === "formatted" ? generateFormattedText() : generateMarkdown();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = activeFormat === "formatted" ? generateFormattedText() : generateMarkdown();
    const ext = activeFormat === "formatted" ? "txt" : "md";
    const filename = `AdCampaign_${adData.productSummary.productName.replace(/[^a-zA-Z0-9]/g, "_")}.${ext}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {lang === "bn" ? "এক্সপোর্ট ও ডাউনলোড" : "Export & Download Campaign"}
            </h3>
            <p className="text-xs text-slate-500">
              {adData.productSummary.productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFormat("formatted")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeFormat === "formatted"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
              }`}
            >
              Plain Text
            </button>
            <button
              onClick={() => setActiveFormat("markdown")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                activeFormat === "markdown"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
              }`}
            >
              Markdown (.md)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 rounded-lg font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-800 bg-slate-50/50 whitespace-pre-wrap leading-relaxed">
          {activeFormat === "formatted" ? generateFormattedText() : generateMarkdown()}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            {lang === "bn" ? "বন্ধ করুন" : "Close"}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{lang === "bn" ? "কপি হয়েছে!" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{lang === "bn" ? "কপি করুন" : "Copy to Clipboard"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
