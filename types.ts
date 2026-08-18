export interface ProductSummary {
  productName: string;
  category?: string;
  targetAudience: string;
  coreProblemSolved: string;
  keyBenefits: string[];
}

// 1. Unique Ad Concept
export interface UniqueAdConcept {
  idea: {
    title: string;
    concept: string;
    uniqueAngle: string;
  };
  customerAvatar: {
    avatarName: string;
    targetAgeAndType: string;
    psychology: string; // Desire, fears, daily struggles
    buyingTrigger: string;
  };
  painsGenerator: {
    corePain: string;
    hiddenFrustrations: string[];
    emotionalCost: string; // What happens if they don't buy
  };
}

// 2. Unique Ad Script
export interface UniqueAdScript {
  title: string;
  durationSeconds: number;
  hook: {
    hookText: string;
    hookStyle: string;
    deliveryTip: string;
  };
  painPoint: {
    painPointDialogue: string;
    emotionalTrigger: string;
  };
  solution: {
    solutionDialogue: string;
    transformation: string;
    callToAction: string;
  };
  fullFormattedScript: string;
}

// 3. Unique Ad Caption
export interface UniqueAdCaption {
  title: string; // Powerful caption title/headline
  painPoint: string; // Story or problem breakdown
  brandwiseSolution: {
    solutionText: string;
    offerAndGuarantee: string;
    callToAction: string;
  };
  fullCaptionFormatted: string;
  hashtags: string[];
}

// 4. Unique Ad Copy (Image Ad)
export interface UniqueAdCopy {
  imageContent: {
    badgeText?: string;
    headline: string;
    subHeadline: string;
    bulletPoints: string[];
    callToActionText: string;
  };
  imagePrompt: {
    aiPrompt: string; // For Midjourney / Gemini / AI image generator
    designerNote: string; // Color palette, model, layout for human graphic designer
  };
}

export interface AdConceptData {
  languageDetected: "bn" | "en" | string;
  productSummary: ProductSummary;
  uniqueAdConcept: UniqueAdConcept;
  uniqueAdScript: UniqueAdScript;
  uniqueAdCaption: UniqueAdCaption;
  uniqueAdCopy: UniqueAdCopy;
}

export type AngleStyleOption =
  | "curiosity"
  | "transformation"
  | "contrarian"
  | "story"
  | "pain-agitate"
  | "direct-offer";

export type ToneOption =
  | "natural"
  | "energetic"
  | "authoritative"
  | "emotional"
  | "humorous"
  | "urgent";
