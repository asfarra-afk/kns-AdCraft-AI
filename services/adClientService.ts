import { AdConceptData } from "../types";
import { generateAdCore, refineAdCore } from "../lib/geminiAdCore";

export interface GenerateAdParams {
  text?: string;
  fileData?: { mimeType: string; base64: string; fileName?: string } | null;
  targetLanguage?: string;
  angleStyle?: string;
  tone?: string;
  variationSeed?: string;
}

export interface RefineAdParams {
  currentAd: AdConceptData;
  instruction: string;
  targetLanguage?: string;
}

// Get optional local storage or Vite env key for fallback
export function getClientGeminiKey(): string {
  try {
    const saved = localStorage.getItem("custom_gemini_api_key");
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    // ignore
  }
  const viteEnv = (import.meta as any).env;
  return viteEnv?.VITE_GEMINI_API_KEY || "";
}

export function saveClientGeminiKey(key: string) {
  try {
    if (key && key.trim()) {
      localStorage.setItem("custom_gemini_api_key", key.trim());
    } else {
      localStorage.removeItem("custom_gemini_api_key");
    }
  } catch (e) {
    // ignore
  }
}

export async function requestGenerateAd(params: GenerateAdParams): Promise<AdConceptData> {
  let serverError: string | null = null;

  // 1. Try server / Netlify function route
  try {
    const response = await fetch("/api/generate-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const resJson = await response.json();
      if (response.ok && resJson.success && resJson.data) {
        return resJson.data as AdConceptData;
      }
      if (resJson.error) {
        serverError = resJson.error;
      }
    } else {
      // Non-JSON response (e.g. 404 HTML from static Netlify host)
      const text = await response.text();
      serverError = `Server returned ${response.status} (Non-JSON).`;
    }
  } catch (err: any) {
    serverError = err.message || "Network request failed.";
  }

  // 2. Client-side fallback if client key exists
  const clientKey = getClientGeminiKey();
  if (clientKey) {
    try {
      const fallbackData = await generateAdCore({
        apiKey: clientKey,
        ...params,
      });
      return fallbackData;
    } catch (clientErr: any) {
      throw new Error(clientErr.message || "Client Gemini generation failed.");
    }
  }

  // 3. Construct a friendly, actionable error message for Netlify
  if (serverError && (serverError.includes("404") || serverError.includes("Non-JSON") || serverError.includes("Failed to fetch"))) {
    throw new Error(
      "Netlify সার্ভারে API রুট পাওয়া যায়নি অথবা GEMINI_API_KEY সেট করা নেই। দয়া করে Netlify Dashboard -> Site configuration -> Environment variables-এ 'GEMINI_API_KEY' যোগ করুন এবং নতুন কোড সহ রিডিপ্লয় (Redeploy) করুন।"
    );
  }

  throw new Error(serverError || "অ্যাড তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
}

export async function requestRefineAd(params: RefineAdParams): Promise<AdConceptData> {
  let serverError: string | null = null;

  try {
    const response = await fetch("/api/refine-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const resJson = await response.json();
      if (response.ok && resJson.success && resJson.data) {
        return resJson.data as AdConceptData;
      }
      if (resJson.error) {
        serverError = resJson.error;
      }
    } else {
      serverError = `Server returned ${response.status} (Non-JSON).`;
    }
  } catch (err: any) {
    serverError = err.message || "Network request failed.";
  }

  const clientKey = getClientGeminiKey();
  if (clientKey) {
    try {
      return await refineAdCore({
        apiKey: clientKey,
        ...params,
      });
    } catch (clientErr: any) {
      throw new Error(clientErr.message || "Client Gemini refinement failed.");
    }
  }

  if (serverError && (serverError.includes("404") || serverError.includes("Non-JSON"))) {
    throw new Error(
      "Netlify সার্ভারে API সংযোগ পাওয়া যায়নি। Netlify Environment variables-এ 'GEMINI_API_KEY' সেট আছে কিনা নিশ্চিত করুন।"
    );
  }

  throw new Error(serverError || "অ্যাড পরিবর্তন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
}
