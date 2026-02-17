
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge', // 高速なレスポンスのためにEdge Runtimeを使用
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { task } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ message: 'API_KEY is not configured in Vercel settings.' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    let prompt = "";
    let responseSchema: any = {};

    if (task === 'quiz') {
      prompt = `Generate a high-level academic English vocabulary quiz question.
      - Word: SAT/GRE/TOEFL level.
      - Options: 4 plausible definitions. IMPORTANT: Each option MUST be in the format "English definition (日本語の定義)".
      - Etymology: Break down into prefix, root, and suffix.
      - Explanation: Provide a deep, professional, and academic explanation in Japanese (日本語).
      - Family Words: 2-3 words in the format "English (Japanese meaning)".
      Output MUST be in JSON format.`;
      
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          word: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          etymology: {
            type: Type.OBJECT,
            properties: {
              prefix: { type: Type.STRING },
              root: { type: Type.STRING },
              suffix: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["explanation"]
          },
          familyWords: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING }
              },
              required: ["word", "meaning"]
            }
          }
        },
        required: ["id", "word", "options", "correctAnswer", "etymology", "familyWords"]
      };
    } else if (task === 'scramble') {
      prompt = `Generate a sophisticated academic passage scramble challenge.
      - Topic: Scientific or philosophical.
      - Passage: 3-5 high-level sentences.
      - Scramble: Divide into 4-6 logical parts.
      - Explanation: A professional analysis of the logical flow in Japanese (日本語).
      - Translation: A natural and elegant Japanese translation.
      Output MUST be in JSON format.`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          topic: { type: Type.STRING },
          fullText: { type: Type.STRING },
          parts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING }
              }
            }
          },
          explanation: { type: Type.STRING },
          translation: { type: Type.STRING }
        },
        required: ["id", "topic", "fullText", "parts", "explanation", "translation"]
      };
    } else {
      return new Response(JSON.stringify({ message: 'Invalid task' }), { status: 400 });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    return new Response(result.text, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return new Response(JSON.stringify({ message: error.message || 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
