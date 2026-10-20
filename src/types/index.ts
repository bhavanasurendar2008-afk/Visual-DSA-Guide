// Core application types

export interface Topic {
  id: string;
  title: string;
  slug: string;
  category: 'data-structures' | 'algorithms' | 'complexity';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  description: string;
  estimatedTime: number; // minutes
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  attempts: QuizAttempt[];
  completedAt: Date;
  topicId: string;
}

export interface QuizHistoryEntry {
  id: string;
  topicId: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string; // ISO timestamp, stored in localStorage
}

export interface UserProgress {
  userId: string;
  topicId: string;
  completedSections: string[];
  quizHighScore: number;
  lastVisited: Date;
  timeSpent: number;
}

export interface RevisionSlide {
  id: number;
  title: string;
  content: string;
  code?: string;
  language?: string;
  tip?: string;
}

export interface ComplexityEntry {
  name: string;
  notation: string;
  description: string;
  example: string;
  color: string;
}

export interface CodeExample {
  python: string;
  cpp: string;
}

export type Theme = 'light' | 'dark';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}
