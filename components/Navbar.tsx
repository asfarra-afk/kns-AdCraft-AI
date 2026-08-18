import React from "react";
import { PlusCircle, Sparkles } from "lucide-react";

interface NavbarProps {
  lang: "bn" | "en";
  setLang: (lang: "bn" | "en") => void;
  onReset: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  onReset,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={onReset}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              AdCraft <span className="text-indigo-600">AI</span>
            </span>
            <span className="block text-[11px] font-medium text-slate-400">
              {lang === "bn" ? "সহজ অ্যাড কপিরাইটার" : "Simple Ad Copywriter"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setLang("bn")}
              className={`px-3 py-1 rounded-lg transition ${
                lang === "bn"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-lg transition ${
                lang === "en"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
          </div>

          {/* Reset / New Ad */}
          {hasResult && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === "bn" ? "নতুন অ্যাড" : "New Ad"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

