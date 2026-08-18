import React, { useState, useRef } from "react";
import {
  Sparkles,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  UploadCloud,
  FileCode,
  PenTool,
} from "lucide-react";
import { AngleStyleOption, ToneOption } from "../types";

interface InputPanelProps {
  lang: "bn" | "en";
  inputText: string;
  setInputText: (text: string) => void;
  fileData: { mimeType: string; base64: string; fileName: string } | null;
  setFileData: (file: { mimeType: string; base64: string; fileName: string } | null) => void;
  angleStyle: AngleStyleOption;
  setAngleStyle: (angle: AngleStyleOption) => void;
  tone: ToneOption;
  setTone: (tone: ToneOption) => void;
  targetLanguage: "auto" | "bn" | "en";
  setTargetLanguage: (target: "auto" | "bn" | "en") => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  lang,
  inputText,
  setInputText,
  fileData,
  setFileData,
  angleStyle,
  setAngleStyle,
  targetLanguage,
  setTargetLanguage,
  onGenerate,
  isLoading,
}) => {
  const [activeMode, setActiveMode] = useState<"text" | "file">("text");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setFileData({
        mimeType: file.type || "application/octet-stream",
        base64,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const hasInput = !!inputText.trim() || !!fileData;

  const styleOptions: Array<{ id: AngleStyleOption; labelBn: string; labelEn: string }> = [
    { id: "curiosity", labelBn: "🎯 কিউরিওসিটি ও হুক (Curiosity Hook)", labelEn: "🎯 Curiosity Hook" },
    { id: "pain-agitate", labelBn: "⚡ সমস্যা ও তীব্র সমাধান (Problem & Solution)", labelEn: "⚡ Problem & Solution" },
    { id: "direct-offer", labelBn: "🎁 অফার ও ডিসকাউন্ট (Offer & Urgency)", labelEn: "🎁 Special Offer" },
    { id: "story", labelBn: "📖 বাস্তব গল্প ও অভিজ্ঞতা (Storytelling)", labelEn: "📖 Storytelling" },
    { id: "transformation", labelBn: "✨ ফলাফল ও বেনিফিট (Transformation)", labelEn: "✨ Before/After Result" },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
      {/* Mode Switcher: Option A (Text) vs Option B (File Upload) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {lang === "bn" ? "প্রোডাক্ট বা অফারের তথ্য দিন" : "Provide Product or Offer Details"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "bn"
              ? "টেক্সট লিখে অথবা যেকোনো ফাইল/ছবি আপলোড করে সরাসরি অ্যাড তৈরি করুন"
              : "Generate ads either by typing text or by uploading any product file/image"}
          </p>
        </div>

        {/* Option A & Option B Toggle Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveMode("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeMode === "text"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "অপশন A: বিবরণ লিখুন" : "Option A: Type Text"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("file")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeMode === "file"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>
              {lang === "bn" ? "অপশন B: ফাইল আপলোড" : "Option B: Upload File"}
              {fileData && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Hidden Global File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
        accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg,.webp"
        className="hidden"
      />

      {/* Option A: Text Input Mode */}
      {activeMode === "text" && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lang === "bn"
                  ? `যেমন:\n• প্রোডাক্ট: খাঁটি সরিষার তেল ও সুন্দরবনের মধু\n• বিশেষত্ব: নিজস্ব ঘানি ও মৌচাক থেকে সংগৃহীত, ১০০% খাঁটি\n• অফার: ডেলিভারি ফ্রি + টেস্ট করে নেওয়ার নিশ্চয়তা!`
                  : `Example:\n• Product: Organic Cold Pressed Coconut Oil\n• Benefits: 100% pure, chemical free, promotes healthy skin & hair\n• Offer: Free shipping + 10% discount this week!`
              }
              rows={5}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl p-4 text-slate-800 placeholder-slate-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition resize-y font-sans shadow-2xs"
            />

            {inputText && (
              <button
                type="button"
                onClick={() => setInputText("")}
                className="absolute top-3 right-3 text-xs font-semibold text-slate-400 hover:text-rose-600 bg-white/80 px-2 py-0.5 rounded-md transition cursor-pointer"
              >
                {lang === "bn" ? "মুছে ফেলুন" : "Clear"}
              </button>
            )}
          </div>

          {/* Quick Notice if file is also attached */}
          {fileData && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="text-indigo-800 font-medium">
                📎 {lang === "bn" ? `ফাইল যুক্ত আছে: ${fileData.fileName}` : `Attached file: ${fileData.fileName}`}
              </span>
              <button
                type="button"
                onClick={() => setFileData(null)}
                className="text-rose-600 font-bold hover:underline"
              >
                {lang === "bn" ? "বাদ দিন" : "Remove"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Option B: File / Image Drag & Drop Area */}
      {activeMode === "file" && (
        <div className="space-y-3">
          {!fileData ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                isDragging
                  ? "border-indigo-600 bg-indigo-50/80 scale-[0.99]"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">
                {lang === "bn"
                  ? "মাউস দিয়ে ফাইল এখানে টেনে আনুন (Drag & Drop)"
                  : "Drag & drop your file here with mouse"}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                {lang === "bn"
                  ? "অথবা কম্পিউটার থেকে ফাইল সিলেক্ট করতে ক্লিক করুন"
                  : "or click anywhere to browse from device"}
              </p>
              <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg shadow-2xs">
                {lang === "bn" ? "সাপোর্টেড: ছবি (PNG, JPG, WebP) ও ডকুমেন্টস (PDF, TXT, DOC)" : "Supports: Images (PNG, JPG, WebP) & Docs (PDF, TXT, DOC)"}
              </span>
            </div>
          ) : (
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                  {fileData.mimeType.includes("image") ? (
                    <ImageIcon className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider block">
                    {lang === "bn" ? "ফাইল আপলোড সম্পন্ন" : "File Uploaded Successfully"}
                  </span>
                  <p className="text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-md">
                    {fileData.fileName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "bn"
                      ? "AI এই ফাইলটির বিষয়বস্তু বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে অ্যাড তৈরি করবে।"
                      : "AI will analyze this file's contents to generate the ad."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  {lang === "bn" ? "অন্য ফাইল দিন" : "Change File"}
                </button>
                <button
                  type="button"
                  onClick={() => setFileData(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Optional Extra Notes for File */}
          <div className="pt-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "(ঐচ্ছিক) ফাইলের সাথে কোনো বিশেষ অফার বা নোট যোগ করতে চাইলে এখানে লিখুন..."
                  : "(Optional) Add any special offer or notes along with the file..."
              }
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>
      )}

      {/* Options Row (Style & Target Language) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4 pt-3 border-t border-slate-100 items-center">
        {/* Ad Style Selector */}
        <div className="sm:col-span-8">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {lang === "bn" ? "অ্যাডের ধরন ও স্টাইল:" : "Ad Angle / Style:"}
          </label>
          <select
            value={angleStyle}
            onChange={(e) => setAngleStyle(e.target.value as AngleStyleOption)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-600 cursor-pointer font-bold"
          >
            {styleOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {lang === "bn" ? opt.labelBn : opt.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Language Selector */}
        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {lang === "bn" ? "কপিরাইটিং ভাষা:" : "Output Language:"}
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value as "auto" | "bn" | "en")}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-600 cursor-pointer font-bold"
          >
            <option value="auto">{lang === "bn" ? "অটো ভাষা (Auto)" : "Auto Language"}</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Big Generate Button */}
      <div className="mt-5">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !hasInput}
          className={`w-full py-3.5 px-6 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition duration-150 cursor-pointer ${
            isLoading
              ? "bg-indigo-400 text-white cursor-wait"
              : !hasInput
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {lang === "bn" ? "অ্যাড তৈরি হচ্ছে..." : "Generating Ad..."}
              </span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {lang === "bn" ? "অ্যাড তৈরি করুন" : "Generate Ad"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
