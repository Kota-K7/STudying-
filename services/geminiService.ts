
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, AcademicPassage } from "../types";

/**
 * 環境変数からAPIキーを安全に取得します。
 * process変数が存在しないブラウザ環境でのクラッシュを防止します。
 */
const getSafeApiKey = (): string => {
  try {
    // 1. process.env.API_KEY が存在するか確認
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // アクセスエラー時は無視
  }
  return '';
};

/**
 * Helper to execute API calls with exponential backoff for 429 errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isQuotaError = 
        error.status === 429 || 
        error.message?.includes("429") || 
        error.message?.includes("RESOURCE_EXHAUSTED");
      
      if (i < maxRetries && isQuotaError) {
        const delay = initialDelay * Math.pow(2, i);
        console.warn(`Quota exceeded. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const fetchQuizQuestion = async (): Promise<QuizQuestion> => {
  return withRetry(async () => {
    const apiKey = getSafeApiKey();
    // API呼び出し直前にインスタンスを生成
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate an IELTS/TOEFL level (C1/C2) vocabulary quiz question focusing on etymology. IMPORTANT: The 'options' must be in the format 'English definition (Japanese translation)'. The 'etymology.explanation' and 'familyWords.meaning' should be written in Japanese for a high-level learner.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Exactly 4 distinct options in 'English (Japanese)' format"
            },
            correctAnswer: { type: Type.STRING },
            etymology: {
              type: Type.OBJECT,
              properties: {
                prefix: { type: Type.STRING },
                root: { type: Type.STRING },
                suffix: { type: Type.STRING },
                explanation: { type: Type.STRING, description: "Detailed explanation in Japanese" }
              },
              required: ["explanation"]
            },
            familyWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING, description: "Meaning in Japanese" }
                }
              }
            }
          },
          required: ["word", "options", "correctAnswer", "etymology", "familyWords"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return { ...data, id: Math.random().toString(36).substr(2, 9) };
  });
};

export const fetchAcademicPassage = async (): Promise<AcademicPassage> => {
  return withRetry(async () => {
    const apiKey = getSafeApiKey();
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate an academic passage (150-200 words) about science, history, or psychology for IELTS/TOEFL. Divide it into exactly 7 logical chunks. Provide the explanation of logical flow and translation in Japanese.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            fullText: { type: Type.STRING },
            parts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 7 chunks in the CORRECT order"
            },
            explanation: { type: Type.STRING, description: "Logical flow analysis in Japanese" },
            translation: { type: Type.STRING, description: "Japanese translation of the passage" }
          },
          required: ["topic", "fullText", "parts", "explanation", "translation"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return {
      id: Math.random().toString(36).substr(2, 9),
      topic: data.topic,
      fullText: data.fullText,
      parts: data.parts.map((p: string, i: number) => ({ id: `part-${i}`, text: p })),
      explanation: data.explanation,
      translation: data.translation
    };
  });
};
