import { useEffect, useState } from 'react';
import type { QuizHistoryEntry } from '../types';

const PROGRESS_KEY = 'dsa-progress';
const QUIZ_SCORES_KEY = 'dsa-quiz-scores';
const QUIZ_HISTORY_KEY = 'dsa-quiz-history';
const MAX_HISTORY_ENTRIES = 50;

function isQuizHistoryEntry(value: unknown): value is QuizHistoryEntry {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Record<string, unknown>;
  return typeof entry.id === 'string'
    && typeof entry.topicId === 'string'
    && typeof entry.correctAnswers === 'number'
    && Number.isFinite(entry.correctAnswers)
    && typeof entry.totalQuestions === 'number'
    && Number.isFinite(entry.totalQuestions)
    && entry.totalQuestions > 0
    && entry.correctAnswers >= 0
    && entry.correctAnswers <= entry.totalQuestions
    && typeof entry.percentage === 'number'
    && Number.isFinite(entry.percentage)
    && entry.percentage >= 0
    && entry.percentage <= 100
    && typeof entry.completedAt === 'string';
}

function loadQuizHistory(): QuizHistoryEntry[] {
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isQuizHistoryEntry)
      .sort((a, b) => {
        const aTime = Date.parse(a.completedAt);
        const bTime = Date.parse(b.completedAt);
        if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
        return bTime - aTime;
      })
      .slice(0, MAX_HISTORY_ENTRIES);
  } catch {
    return [];
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    } catch { return {}; }
  });

  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem(QUIZ_SCORES_KEY) || '{}');
    } catch { return {}; }
  });

  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>(loadQuizHistory);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(quizScores));
  }, [quizScores]);

  useEffect(() => {
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(quizHistory));
  }, [quizHistory]);

  const markTopicVisited = (topicId: string) => {
    setProgress(prev => ({ ...prev, [topicId]: Math.max(prev[topicId] || 0, 25) }));
  };

  const markSectionComplete = (topicId: string, percentage: number) => {
    setProgress(prev => ({ ...prev, [topicId]: Math.max(prev[topicId] || 0, percentage) }));
  };

  // Kept for backwards compatibility; new quiz completions use recordQuizAttempt.
  const saveQuizScore = (topicId: string, score: number) => {
    setQuizScores(prev => ({ ...prev, [topicId]: Math.max(prev[topicId] || 0, score) }));
  };

  const recordQuizAttempt = (
    topicId: string,
    correctAnswers: number,
    totalQuestions: number,
  ): QuizHistoryEntry | null => {
    if (totalQuestions <= 0) return null;

    const safeCorrect = Math.max(0, Math.min(correctAnswers, totalQuestions));
    const percentage = Math.round((safeCorrect / totalQuestions) * 100);
    const entry: QuizHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      topicId,
      correctAnswers: safeCorrect,
      totalQuestions,
      percentage,
      completedAt: new Date().toISOString(),
    };

    setQuizHistory(prev => [entry, ...prev].slice(0, MAX_HISTORY_ENTRIES));
    setQuizScores(prev => ({ ...prev, [topicId]: Math.max(prev[topicId] || 0, percentage) }));

    return entry;
  };

  const getTopicProgress = (topicId: string) => progress[topicId] || 0;
  const getQuizScore = (topicId: string) => quizScores[topicId] || 0;

  const overallProgress = () => {
    const topicIds = ['arrays', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 'sorting', 'big-o'];
    const total = topicIds.reduce((sum, id) => sum + (progress[id] || 0), 0);
    return Math.round(total / topicIds.length);
  };

  return {
    progress,
    quizScores,
    quizHistory,
    markTopicVisited,
    markSectionComplete,
    saveQuizScore,
    recordQuizAttempt,
    getTopicProgress,
    getQuizScore,
    overallProgress,
  };
}
