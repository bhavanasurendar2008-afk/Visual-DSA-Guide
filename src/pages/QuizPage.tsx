import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { getAllQuestions, getQuestionsByTopic } from '../data/quiz';
import { getTopicById } from '../data/topics';
import { useProgress } from '../hooks/useProgress';
import type { QuizQuestion } from '../types';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { cn } from '../lib/utils';

const GENERAL_QUIZ_SIZE = 15;
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function formatTopicId(topicId: string) {
  return topicId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function isUsableQuestion(question: QuizQuestion) {
  return Boolean(question.question?.trim())
    && Array.isArray(question.options)
    && question.options.length >= 2
    && Number.isInteger(question.correctIndex)
    && question.correctIndex >= 0
    && question.correctIndex < question.options.length;
}

function buildQuiz(topicId?: string): QuizQuestion[] {
  const available = (topicId ? getQuestionsByTopic(topicId) : getAllQuestions())
    .filter(isUsableQuestion);
  return topicId ? available : available.slice(0, GENERAL_QUIZ_SIZE);
}

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: Array<number | null>;
  quizTitle: string;
  onRetry: () => void;
}

function QuizResults({ questions, answers, quizTitle, onRetry }: QuizResultsProps) {
  const correctCount = questions.reduce(
    (total, question, index) => total + (answers[index] === question.correctIndex ? 1 : 0),
    0,
  );
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const message =
    percentage >= 90
      ? 'Outstanding — you have this topic mastered!'
      : percentage >= 75
        ? 'Great job — a quick review and you are exam-ready.'
        : percentage >= 50
          ? 'Good start — review the explanations below and try again.'
          : 'Keep practising — read the revision notes, then retake the quiz.';

  return (
    <div className="space-y-6">
      <Card gradient className="text-center">
        <div className="text-5xl mb-3">{percentage >= 80 ? '🏆' : percentage >= 50 ? '💪' : '📚'}</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {quizTitle} results
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{message}</p>

        <div className="my-5">
          <p className="text-5xl font-extrabold gradient-text">{percentage}%</p>
          <p className="text-sm text-slate-500 mt-1">
            {correctCount} of {questions.length} correct
          </p>
        </div>

        <ProgressBar
          value={percentage}
          size="lg"
          color={percentage >= 80 ? 'green' : percentage >= 50 ? 'yellow' : 'red'}
          className="max-w-md mx-auto"
        />

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button type="button" onClick={onRetry} className="btn-primary flex items-center gap-2">
            <RotateCcw size={16} /> Try again
          </button>
          <Link to="/progress" className="btn-secondary flex items-center gap-2">
            <Trophy size={16} /> View progress
          </Link>
          <Link to="/topics" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} /> Back to topics
          </Link>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Answer review</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Every answer includes the correct option and a short explanation.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctIndex;
              const userAnswerText =
                userAnswer !== null && userAnswer !== undefined
                  ? question.options[userAnswer] ?? 'Unknown option'
                  : 'Not answered';
              const correctAnswerText = question.options[question.correctIndex] ?? 'Unknown option';

              return (
                <div
                  key={`${question.id}-${index}`}
                  className={cn(
                    'rounded-xl border p-4',
                    isCorrect
                      ? 'border-green-200 bg-green-50/60 dark:border-green-700/40 dark:bg-green-900/10'
                      : 'border-red-200 bg-red-50/60 dark:border-red-700/40 dark:bg-red-900/10',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {index + 1}. {question.question}
                    </p>
                    <Badge variant={isCorrect ? 'green' : 'red'} size="sm" className="flex-shrink-0">
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>

                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Your answer:</span> {userAnswerText}
                    </p>
                    {!isCorrect && (
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">Correct answer:</span> {correctAnswerText}
                      </p>
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {question.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function QuizPage() {
  const { topicId } = useParams<{ topicId?: string }>();
  const quizTopic = topicId ? getTopicById(topicId) : undefined;
  const quizTitle = topicId ? quizTopic?.title ?? formatTopicId(topicId) : 'Mixed Practice';
  const quizKey = topicId ?? 'mixed';

  const questions = useMemo(() => buildQuiz(topicId), [topicId]);
  const { recordQuizAttempt } = useProgress();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [finished, setFinished] = useState(false);
  const resultSavedRef = useRef(false);

  // The same component handles /quiz and /quiz/:topicId, so reset when the route changes.
  useEffect(() => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    resultSavedRef.current = false;
  }, [quizKey]);

  useEffect(() => {
    document.title = `${quizTitle} Quiz — DSA Visual Study Guide`;
    return () => {
      document.title = 'DSA Visual Study Guide';
    };
  }, [quizTitle]);

  const currentIndex = questions.length > 0 ? Math.min(current, questions.length - 1) : 0;
  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const handleNext = () => {
    if (selected === null || !question) return;

    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = selected;
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      const correctCount = questions.reduce(
        (total, item, index) => total + (updatedAnswers[index] === item.correctIndex ? 1 : 0),
        0,
      );
      if (!resultSavedRef.current) {
        resultSavedRef.current = true;
        recordQuizAttempt(quizKey, correctCount, questions.length);
      }
      setFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrent(currentIndex + 1);
    setSelected(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    resultSavedRef.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageHeader = (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/dashboard" className="hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/quiz" className="hover:text-primary-600 transition-colors">
            Quiz
          </Link>
          {topicId && (
            <>
              <span>/</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{quizTitle}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {quizTitle} <span className="gradient-text">Quiz</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {topicId
            ? questions.length > 0
              ? `Test your understanding of ${quizTitle} with ${questions.length} multiple-choice question${questions.length === 1 ? '' : 's'}.`
              : `There are no questions for ${quizTitle} yet — try the mixed quiz or another topic.`
            : `${questions.length} multiple-choice questions drawn from across the DSA topics.`}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">{questions.length} questions</Badge>
        <Badge variant="purple">Instant feedback</Badge>
      </div>
    </div>
  );

  if (questions.length === 0) {
    return (
      <div className="space-y-6 animate-slide-up">
        {pageHeader}
        <Alert type="warning" title="No quiz questions available">
          {topicId
            ? `There are no questions for “${quizTitle}” yet. Try the mixed quiz or browse another topic.`
            : 'The quiz question bank is empty. You can still revise the topics while questions are being added.'}
        </Alert>
        <div className="flex flex-wrap gap-3">
          <Link to="/quiz" className="btn-primary flex items-center gap-2">
            <Target size={16} /> Mixed quiz
          </Link>
          <Link to="/topics" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} /> Browse topics
          </Link>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="space-y-6 animate-slide-up">
        {pageHeader}
        <QuizResults
          questions={questions}
          answers={answers}
          quizTitle={quizTitle}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const correctOption = question.options[question.correctIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === question.correctIndex;
  const progressPercentage = Math.round((currentIndex / questions.length) * 100);

  return (
    <div className="space-y-6 animate-slide-up">
      {pageHeader}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-slate-500">{progressPercentage}% complete</span>
          </div>
          <ProgressBar value={progressPercentage} size="sm" className="mt-2" />
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant={quizTopic ? 'primary' : 'purple'} size="sm">
              {quizTopic?.title ?? (topicId ? quizTitle : 'Mixed Practice')}
            </Badge>
            <Badge
              variant={
                question.difficulty === 'easy'
                  ? 'green'
                  : question.difficulty === 'medium'
                    ? 'yellow'
                    : 'red'
              }
              size="sm"
            >
              {question.difficulty}
            </Badge>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-2.5">
            {question.options.map((option, index) => {
              const isSelectedOption = selected === index;
              const isCorrectOption = index === question.correctIndex;
              const revealed = selected !== null;

              return (
                <button
                  key={`${question.id}-option-${index}`}
                  type="button"
                  onClick={() => handleSelect(index)}
                  disabled={revealed}
                  aria-pressed={isSelectedOption}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200',
                    !revealed &&
                      'border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10',
                    revealed &&
                      isCorrectOption &&
                      'border-green-400 bg-green-50 dark:border-green-500/60 dark:bg-green-900/20',
                    revealed &&
                      isSelectedOption &&
                      !isCorrectOption &&
                      'border-red-400 bg-red-50 dark:border-red-500/60 dark:bg-red-900/20',
                    revealed &&
                      !isSelectedOption &&
                      !isCorrectOption &&
                      'border-slate-200 dark:border-slate-700 opacity-60',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                      revealed && isCorrectOption
                        ? 'bg-green-500 text-white'
                        : revealed && isSelectedOption
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
                    )}
                  >
                    {OPTION_LETTERS[index] ?? index + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                    {option}
                  </span>
                  {revealed && isCorrectOption && (
                    <CheckCircle2 size={18} className="flex-shrink-0 text-green-500" />
                  )}
                  {revealed && isSelectedOption && !isCorrectOption && (
                    <XCircle size={18} className="flex-shrink-0 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <Alert
              type={isCorrect ? 'success' : 'error'}
              title={isCorrect ? 'Correct!' : 'Not quite — review the explanation'}
              className="mt-4"
            >
              {isCorrect ? (
                <p>{question.explanation}</p>
              ) : (
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Correct answer:</span> {correctOption}
                  </p>
                  <p>{question.explanation}</p>
                </div>
              )}
            </Alert>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <Link to="/topics" className="text-sm text-slate-500 hover:text-primary-600 inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Exit quiz
            </Link>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isAnswered}
              className={cn(
                'btn-primary inline-flex items-center justify-center gap-2',
                !isAnswered && 'opacity-50 cursor-not-allowed hover:bg-primary-600 active:scale-100',
              )}
            >
              {isLastQuestion ? 'See results' : 'Next question'}
              {isLastQuestion ? <Trophy size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
