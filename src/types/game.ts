export type Difficulty = 'elementary' | 'intermediate' | 'advanced';

export type QuizDirection = 'en_to_ko' | 'ko_to_en' | 'spelling' | 'listening';

export type GameMode = 'multiple_choice' | 'spelling' | 'listening';

export interface Flower {
  id: string;
  english: string;
  korean: string;
  pronunciation: string; // Phonetic transcription and Korean approximation
  difficulty: Difficulty;
  flowerLanguage: string; // 꽃말
  hint: string;
  funFact: string;
  category: string;
  accentColor: string; // Hex color for botanical card theme
  bgGradient: string; // Tailwind gradient classes
}

export interface QuizQuestion {
  flower: Flower;
  options: Flower[]; // 4 options for multiple choice
  correctIndex: number;
  direction: 'en_to_ko' | 'ko_to_en' | 'listening' | 'spelling';
}

export interface ScoreRecord {
  id: string;
  playerName: string;
  date: string; // ISO string
  formattedDate: string;
  difficulty: Difficulty;
  mode: GameMode;
  score: number;
  maxCombo: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number; // percentage (0 - 100)
  timeTakenSec: number;
  missedFlowerIds: string[];
}

export interface MistakeEntry {
  flowerId: string;
  wrongCount: number;
  lastMissedDate: string;
}

export type ActiveTab = 'quiz' | 'dictionary' | 'scores' | 'mistakes';
