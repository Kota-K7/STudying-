
export interface EtymologyData {
  prefix?: string;
  root?: string;
  suffix?: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  word: string;
  options: string[];
  correctAnswer: string;
  etymology: EtymologyData;
  familyWords: { word: string; meaning: string }[];
}

export interface ScramblePart {
  id: string;
  text: string;
}

export interface AcademicPassage {
  id: string;
  topic: string;
  fullText: string;
  parts: ScramblePart[];
  explanation: string;
  translation: string;
}

export type View = 'home' | 'quiz' | 'scramble' | 'stats';

export interface UserStats {
  quizScore: number;
  quizzesCompleted: number;
  scrambleCompleted: number;
}
