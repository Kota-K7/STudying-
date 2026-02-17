
import { QuizQuestion, AcademicPassage } from "../types";

/**
 * サーバー側のプロキシAPI（/api/generate）を呼び出し、
 * セキュアにGeminiからの応答を取得します。
 */
async function callProxy(task: 'quiz' | 'scramble'): Promise<any> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export async function fetchQuizQuestion(): Promise<QuizQuestion> {
  try {
    return await callProxy('quiz');
  } catch (error) {
    console.error("Quiz fetch failed:", error);
    throw error;
  }
}

export async function fetchAcademicPassage(): Promise<AcademicPassage> {
  try {
    return await callProxy('scramble');
  } catch (error) {
    console.error("Passage fetch failed:", error);
    throw error;
  }
}
