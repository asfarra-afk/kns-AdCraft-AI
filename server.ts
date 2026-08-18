import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
   import { generateAdCore, refineAdCore } from "./src/lib/geminiAdCore";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for payload handling (supporting document base64 & images)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// API Route: Generate Ad
app.post("/api/generate-ad", async (req, res) => {
  try {
    const { text, fileData, targetLanguage, angleStyle, tone, variationSeed } = req.body;

    if (!text && !fileData) {
      return res.status(400).json({ error: "Please provide product text or upload a file." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in server environment variables.",
      });
    }

    const adData = await generateAdCore({
      apiKey,
      text,
      fileData,
      targetLanguage,
      angleStyle,
      tone,
      variationSeed,
    });

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

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in server environment variables.",
      });
    }

    const updatedAd = await refineAdCore({
      apiKey,
      currentAd,
      instruction,
      targetLanguage,
    });

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
