
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, AcademicPassage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchQuizQuestion(): Promise<QuizQuestion> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a high-level academic English vocabulary quiz question.
    - Word: SAT/GRE/TOEFL level.
    - Options: 4 plausible definitions. IMPORTANT: Each option MUST be in the format "English definition (日本語の定義)".
    - Etymology: Break down into prefix, root, and suffix.
    - Explanation: Provide a deep, professional, and academic explanation in Japanese (日本語).
    - Family Words: 2-3 words in the format "English (Japanese meaning)".
    Output MUST be in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to receive a response.");
  return JSON.parse(text.trim());
}

export async function fetchAcademicPassage(): Promise<AcademicPassage> {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a sophisticated academic passage scramble challenge.
    - Topic: Scientific or philosophical.
    - Passage: 3-5 high-level sentences.
    - Scramble: Divide into 4-6 logical parts.
    - Explanation: A professional analysis of the logical flow in Japanese (日本語).
    - Translation: A natural and elegant Japanese translation.
    Output MUST be in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to receive a response.");
  return JSON.parse(text.trim());
}
