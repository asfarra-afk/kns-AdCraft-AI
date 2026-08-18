import { refineAdCore } from "../../src/lib/geminiAdCore";

// Universal handler for Netlify v1
export async function handler(event: any) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
    const { currentAd, instruction, targetLanguage } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error:
            "GEMINI_API_KEY Netlify Environment Variables-এ সেট করা নেই। দয়া করে Netlify Dashboard -> Site configuration -> Environment variables-এ GEMINI_API_KEY যোগ করুন।",
        }),
      };
    }

    const data = await refineAdCore({
      apiKey,
      currentAd,
      instruction,
      targetLanguage,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (err: any) {
    console.error("Netlify Function Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message || "Failed to refine ad concept on Netlify serverless.",
      }),
    };
  }
}

// Default export for Netlify v2
export default async (req: Request) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.json();
    const { currentAd, instruction, targetLanguage } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "GEMINI_API_KEY Netlify Environment Variables-এ সেট করা নেই। দয়া করে Netlify Dashboard -> Site configuration -> Environment variables-এ GEMINI_API_KEY যোগ করুন।",
        }),
        { status: 500, headers }
      );
    }

    const data = await refineAdCore({
      apiKey,
      currentAd,
      instruction,
      targetLanguage,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error("Netlify Function Error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Failed to refine ad concept on Netlify serverless.",
      }),
      { status: 500, headers }
    );
  }
};
