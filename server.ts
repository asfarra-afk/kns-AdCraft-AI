import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for large payload handling (document base64 & images)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Helper to get Gemini Client with recommended User-Agent header
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Structured schema for Ad Output matching user's requested 4 modules
const adResponseSchema = {
  type: Type.OBJECT,
  properties: {
    languageDetected: {
      type: Type.STRING,
      description: "Detected language: 'bn' for Bengali, 'en' for English",
    },
    productSummary: {
      type: Type.OBJECT,
      properties: {
        productName: { type: Type.STRING },
        category: { type: Type.STRING },
        targetAudience: { type: Type.STRING },
        coreProblemSolved: { type: Type.STRING },
        keyBenefits: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["productName", "targetAudience", "coreProblemSolved", "keyBenefits"],
    },

    // 1. UNIQUE AD CONCEPT
    uniqueAdConcept: {
      type: Type.OBJECT,
      description: "1. Unique Ad Concept: Idea, Customer Avatar, Pains Generator",
      properties: {
        idea: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            concept: { type: Type.STRING, description: "অ্যাডের মূল সৃষ্টিশীল আইডিয়া ও অ্যাঙ্গেল" },
            uniqueAngle: { type: Type.STRING, description: "কেন এটি অন্য সব সাধারণ অ্যাড থেকে সম্পূর্ণ আলাদা ও ইউনিক" },
          },
          required: ["title", "concept", "uniqueAngle"],
        },
        customerAvatar: {
          type: Type.OBJECT,
          properties: {
            avatarName: { type: Type.STRING, description: "আইডিয়াল কাস্টমার প্রোফাইল নাম বা টাইপ" },
            targetAgeAndType: { type: Type.STRING, description: "বয়স, পেশা, জীবনধারা" },
            psychology: { type: Type.STRING, description: "তাদের ভেতরের ভয়, আশা, প্রতিদিনের স্ট্রাগল ও সাইকোলজি" },
            buyingTrigger: { type: Type.STRING, description: "কোন কথায় বা কারণে তারা সাথে সাথে কেনার সিদ্ধান্ত নেবে" },
          },
          required: ["avatarName", "targetAgeAndType", "psychology", "buyingTrigger"],
        },
        painsGenerator: {
          type: Type.OBJECT,
          properties: {
            corePain: { type: Type.STRING, description: "কাস্টমারের সবচেয়ে বড় এবং গভীর পেইন পয়েন্ট" },
            hiddenFrustrations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "কাস্টমার প্রতিদিন যেসব লুকায়িত সমস্যা বা বিরক্তির মুখোমুখি হন (৩-৪টি বুলেট পয়েন্ট)",
            },
            emotionalCost: { type: Type.STRING, description: "এখন এই প্রোডাক্ট না কিনলে বা সমাধান না করলে ভবিষ্যতে কী ক্ষতি/পস্তাতে হতে পারে" },
          },
          required: ["corePain", "hiddenFrustrations", "emotionalCost"],
        },
      },
      required: ["idea", "customerAvatar", "painsGenerator"],
    },

    // 2. UNIQUE AD SCRIPT
    uniqueAdScript: {
      type: Type.OBJECT,
      description: "2. Unique Ad Script: Hook, Pinpoint / Pain Point, Solution",
      properties: {
        title: { type: Type.STRING },
        durationSeconds: { type: Type.INTEGER, description: "Estimated duration in seconds (30-60s)" },
        hook: {
          type: Type.OBJECT,
          properties: {
            hookText: { type: Type.STRING, description: "ভিডিওর প্রথম ৩ সেকেন্ডের স্ক্রল থামানোর লাইন" },
            hookStyle: { type: Type.STRING, description: "যেমন: প্যাটার্ন ইন্টারাপ্ট / কিউরিওসিটি প্রশ্ন / শক ভ্যালু" },
            deliveryTip: { type: Type.STRING, description: "কণ্ঠের স্বর, এক্সপ্রেশন বা অ্যাক্টিং নির্দেশিকা" },
          },
          required: ["hookText", "hookStyle", "deliveryTip"],
        },
        painPoint: {
          type: Type.OBJECT,
          properties: {
            painPointDialogue: { type: Type.STRING, description: "ভিডিওতে কাস্টমারের সমস্যা ও অস্বস্তিকর সত্য তুলে ধরার ডায়ালগ" },
            emotionalTrigger: { type: Type.STRING, description: "কোন আবেগীয় জায়গায় আঘাত করছে" },
          },
          required: ["painPointDialogue", "emotionalTrigger"],
        },
        solution: {
          type: Type.OBJECT,
          properties: {
            solutionDialogue: { type: Type.STRING, description: "প্রোডাক্টের মাধ্যমে কীভাবে সমস্যার জাদুকরী সমাধান মিলবে তার ডায়ালগ" },
            transformation: { type: Type.STRING, description: "কাস্টমার ব্যবহারের পর কী লাইফ-চেঞ্জিং ফলাফল পাবে" },
            callToAction: { type: Type.STRING, description: "ভিডিওর শেষ ডায়ালগ ও অ্যাকশন নেওয়ার আহ্বান" },
          },
          required: ["solutionDialogue", "transformation", "callToAction"],
        },
        fullFormattedScript: {
          type: Type.STRING,
          description: "রেকর্ডিংয়ের উপযোগী পূর্ণাঙ্গ কথোপকথন স্ক্রিপ্ট (Visuals + Spoken Dialogue)",
        },
      },
      required: ["title", "durationSeconds", "hook", "painPoint", "solution", "fullFormattedScript"],
    },

    // 3. UNIQUE AD CAPTION
    uniqueAdCaption: {
      type: Type.OBJECT,
      description: "3. Unique Ad Caption: Title, Pinpoint / Pain Point, Brandwise Solution",
      properties: {
        title: { type: Type.STRING, description: "সোশ্যাল মিডিয়া পোস্টের চোখ ধাঁধানো আকর্ষণীয় টাইটেল / হেডলাইন" },
        painPoint: { type: Type.STRING, description: "ক্যাপশনে কাস্টমারের সমস্যা ও প্রাসঙ্গিক গল্প তুলে ধরা" },
        brandwiseSolution: {
          type: Type.OBJECT,
          properties: {
            solutionText: { type: Type.STRING, description: "ব্র্যান্ডের সুনির্দিষ্ট সমাধান ও বিশেষত্ব" },
            offerAndGuarantee: { type: Type.STRING, description: "অফার, ক্যাশ অন ডেলিভারি বা গ্যারান্টির বিবরণ" },
            callToAction: { type: Type.STRING, description: "ইনবক্স/অর্ডার লিংক/হোয়াটসঅ্যাপে ক্লিক করার নির্দেশনা" },
          },
          required: ["solutionText", "offerAndGuarantee", "callToAction"],
        },
        fullCaptionFormatted: {
          type: Type.STRING,
          description: "ফেসবুক/ইনস্টাগ্রামে কপি-পেস্ট করার মতো সুন্দর ইমোজি যুক্ত সম্পূর্ণ ক্যাপশন",
        },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["title", "painPoint", "brandwiseSolution", "fullCaptionFormatted", "hashtags"],
    },

    // 4. UNIQUE AD COPY (IMAGE AD)
    uniqueAdCopy: {
      type: Type.OBJECT,
      description: "4. Unique Ad Copy: Image Content, Image Prompt",
      properties: {
        imageContent: {
          type: Type.OBJECT,
          properties: {
            badgeText: { type: Type.STRING, description: "ছবির কোণায় বসার স্টিকার/ব্যাজ (যেমন: 'সীমিত অফার', '১০০% খাঁটি')" },
            headline: { type: Type.STRING, description: "ব্যানারের প্রধান বড় অক্ষরের হেডলাইন (সর্বোচ্চ ৫-৭ শব্দ)" },
            subHeadline: { type: Type.STRING, description: "সাব-হেডলাইন বা বেনিফিট লাইন" },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "ব্যানারে থাকার মতো ২-৩টি ছোট বুলেট পয়েন্ট বা সুবিধা",
            },
            callToActionText: { type: Type.STRING, description: "ব্যানারের ভেতর বাটন টেক্সট (যেমন: 'এখনই অর্ডার করুন')" },
          },
          required: ["headline", "subHeadline", "bulletPoints", "callToActionText"],
        },
        imagePrompt: {
          type: Type.OBJECT,
          properties: {
            aiPrompt: {
              type: Type.STRING,
              description: "Detailed English text-to-image generation prompt suitable for Midjourney / Gemini / Imagen to generate high-converting realistic product visual",
            },
            designerNote: {
              type: Type.STRING,
              description: "গ্রাফিক ডিজাইনারের জন্য গাইডলাইন (রঙ, প্রোডাক্ট প্লেসমেন্ট, ফন্ট স্টাইল, ক্লিনার স্পেস)",
            },
          },
          required: ["aiPrompt", "designerNote"],
        },
      },
      required: ["imageContent", "imagePrompt"],
    },
  },
  required: [
    "languageDetected",
    "productSummary",
    "uniqueAdConcept",
    "uniqueAdScript",
    "uniqueAdCaption",
    "uniqueAdCopy",
  ],
};

// Helper to call Gemini with model fallback and automatic retry on 503 / high demand spikes
async function generateContentWithFallback(
  ai: GoogleGenAI,
  contents: any,
  config: any
) {
  const candidateModels = [
    "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });

        const rawText = response.text;
        if (rawText) {
          return JSON.parse(rawText);
        }
      } catch (err: any) {
        lastError = err;
        const errString = (err?.message || JSON.stringify(err) || "").toLowerCase();
        const isTemporarySpike =
          errString.includes("503") ||
          errString.includes("unavailable") ||
          errString.includes("high demand") ||
          errString.includes("429") ||
          errString.includes("resource_exhausted") ||
          errString.includes("rate limit") ||
          errString.includes("overloaded");

        if (isTemporarySpike && attempt === 1) {
          // Wait 600ms before quick retry
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }

        // If still failing with 503/429, break to next candidate model
        if (isTemporarySpike) {
          console.warn(`Model ${model} is experiencing high demand (503/429). Falling back to next available model...`);
          break;
        }

        // For other fatal errors (e.g. invalid arguments), throw immediately
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to generate response after trying available models.");
}

// API Route: Generate Ad Concept
app.post("/api/generate-ad", async (req, res) => {
  try {
    const { text, fileData, targetLanguage, angleStyle, tone, variationSeed } = req.body;

    if (!text && !fileData) {
      return res.status(400).json({ error: "Please provide product text or upload a file." });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are a world-class Direct Response Copywriter, Creative Director, and Ad Strategist specializing in high-converting eCommerce and brand ads (specifically for Bengali and South Asian markets, as well as global audiences).

Your goal is to generate 4 distinct, highly focused advertising modules:
1. UNIQUE AD CONCEPT:
   - Idea & Unique Angle
   - Customer Avatar (Demographics, psychology, subconscious desires, buying triggers)
   - Pains Generator (Core pain, hidden daily frustrations, emotional cost of inaction)

2. UNIQUE AD SCRIPT:
   - Hook (First 0:00-0:03s pattern interrupt line)
   - Pinpoint / Pain Point (Agitating the real friction and struggles)
   - Solution (Brand transformation, life-after-product, clear CTA)
   - Full Formatted Script (Clean dialogue + visual directions ready to record)

3. UNIQUE AD CAPTION:
   - Title / Hook Headline (High-converting Facebook post title)
   - Pain Point (Engaging narrative agitating why usual solutions fail)
   - Brandwise Solution (Product unique proposition, offer, guarantee, CTA)
   - Full Caption Formatted (Ready-to-paste social post with line breaks and emojis)
   - Relevant Hashtags

4. UNIQUE AD COPY (IMAGE AD):
   - Image Content (Headline, Sub-headline, 2-3 Bullet points, Badge/Offer, Button CTA)
   - Image Prompt (Detailed English AI prompt for Midjourney/Gemini + clear layout notes for graphic designers)

COPYWRITING RULES:
- Language: If user wrote in Bengali or requested Bengali, write in natural, conversational, persuasive Bengali (বাংলিশ বা কাঠখোট্টা অনুবাদ নয়, বরং স্বাভাবিক আকর্ষণীয় বাংলা কথ্য ভাষা)। If requested English, write in punchy direct response English.
- Avoid boring clichés (e.g. "সেরা অফার", "দ্রুত আসুন", "আমাদের প্রোডাক্ট ভালো") - use curiosity, emotional hooks, and concrete benefits.
- Tone: ${tone || "natural, persuasive and high-converting"}.
- Creative Angle: ${angleStyle || "curiosity and transformation"}.
- Seed: ${variationSeed || Date.now()}`;

    const contents: any[] = [];

    // Attach file if provided
    if (fileData && fileData.base64 && fileData.mimeType) {
      contents.push({
        inlineData: {
          mimeType: fileData.mimeType,
          data: fileData.base64,
        },
      });
    }

    let textPrompt = `Analyze the following product/offer and generate the 4 requested ad modules in JSON format.`;
    if (text) {
      textPrompt += `\n\nUSER INPUT / PRODUCT DETAILS:\n${text}`;
    }
    if (targetLanguage && targetLanguage !== "auto") {
      textPrompt += `\n\nTARGET LANGUAGE: ${targetLanguage === "bn" ? "Bengali (বাংলা)" : "English"}`;
    }
    if (angleStyle) {
      textPrompt += `\nPREFERRED ANGLE STYLE: ${angleStyle}`;
    }

    contents.push({ text: textPrompt });

    const adData = await generateContentWithFallback(
      ai,
      contents.length === 1 ? contents[0].text : { parts: contents },
      {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: adResponseSchema,
        temperature: 0.85,
      }
    );

    return res.json({ success: true, data: adData });
  } catch (err: any) {
    console.error("Error generating ad:", err);
    let userFriendlyMessage = "অ্যাড জেনারেট করতে সাময়িক সমস্যা হয়েছে। দয়া করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।";
    if (err?.message && !err.message.includes("{")) {
      userFriendlyMessage = err.message;
    }
    return res.status(500).json({
      error: userFriendlyMessage,
    });
  }
});

// API Route: Refine / Modify Ad
app.post("/api/refine-ad", async (req, res) => {
  try {
    const { currentAd, instruction, targetLanguage } = req.body;

    if (!currentAd || !instruction) {
      return res.status(400).json({ error: "Missing current ad data or refinement instruction." });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are a direct response copywriter. The user wants to modify their existing ad concept based on specific instructions.
Keep all good elements intact and update the affected parts of the 4 modules (Unique Ad Concept, Unique Ad Script, Unique Ad Caption, Unique Ad Copy) according to user instruction.

Instruction: "${instruction}"
Target Language: ${targetLanguage || currentAd.languageDetected || "as original"}`;

    const updatedAd = await generateContentWithFallback(
      ai,
      `CURRENT AD CONCEPT JSON:
${JSON.stringify(currentAd, null, 2)}

INSTRUCTION: ${instruction}`,
      {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: adResponseSchema,
        temperature: 0.85,
      }
    );

    return res.json({ success: true, data: updatedAd });
  } catch (err: any) {
    console.error("Error refining ad:", err);
    let userFriendlyMessage = "অ্যাড রিফাইন করতে সাময়িক সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।";
    if (err?.message && !err.message.includes("{")) {
      userFriendlyMessage = err.message;
    }
    return res.status(500).json({ error: userFriendlyMessage });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
