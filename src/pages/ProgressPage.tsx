import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  History,
  RotateCcw,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { topics } from '../data/topics';
import { useProgress } from '../hooks/useProgress';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

type ScoreVariant = 'green' | 'yellow' | 'red';

function getScoreMeta(score: number): {
  label: string;
  variant: ScoreVariant;
  message: string;
  textColor: string;
} {
  if (score >= 80) {
    return {
      label: 'Strong',
      variant: 'green',
      message: 'Great work — keep it fresh.',
      textColor: 'text-green-600 dark:text-green-400',
    };
  }
  if (score >= 50) {
    return {
      label: 'Review',
      variant: 'yellow',
      message: 'Review the explanations, then retry.',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    };
  }
  return {
    label: 'Practise',
    variant: 'red',
    message: 'Revisit the topic notes, then retry.',
    textColor: 'text-red-600 dark:text-red-400',
  };
}

function formatAttemptDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ProgressPage() {
  const { quizScores, quizHistory, overallProgress, getTopicProgress } = useProgress();

  const overall = overallProgress();
  const startedTopics = topics.filter(topic => getTopicProgress(topic.id) > 0).length;
  const scoreEntries = Object.entries(quizScores).filter(([, score]) => Number.isFinite(score));
  const attemptCount = quizHistory.length;
  const bestScore = scoreEntries.length > 0
    ? Math.max(...scoreEntries.map(([, score]) => score))
    : null;
  const averageBestScore = scoreEntries.length > 0
    ? Math.round(scoreEntries.reduce((sum, [, score]) => sum + score, 0) / scoreEntries.length)
    : null;
  const averageAttemptScore = attemptCount > 0
    ? Math.round(quizHistory.reduce((sum, attempt) => sum + attempt.percentage, 0) / attemptCount)
    : null;
  const completedQuizCount = attemptCount > 0 ? attemptCount : scoreEntries.length;
  const orderedResults = [...scoreEntries].sort((a, b) => b[1] - a[1]);
  const recentAttempts = quizHistory.slice(0, 10);
  const headlineAverage = averageAttemptScore ?? averageBestScore;
  const noActivity = overall === 0 && scoreEntries.length === 0 && attemptCount === 0;

  const getQuizLabel = (id: string) => {
    if (id === 'mixed') return 'Mixed Practice';
    return topics.find(topic => topic.id === id)?.title ?? id;
  };

  const nextTopics = topics
    .filter(topic => getTopicProgress(topic.id) < 100)
    .sort((a, b) => getTopicProgress(a.id) - getTopicProgress(b.id))
    .slice(0, 3);

  const stats = [
    {
      label: 'Overall Progress',
      value: `${overall}%`,
      icon: TrendingUp,
      color: 'text-primary-600',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Topics Started',
      value: `${startedTopics}/${topics.length}`,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Quizzes Taken',
      value: `${completedQuizCount}`,
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Best Quiz Score',
      value: bestScore === null ? '–' : `${bestScore}%`,
      icon: Trophy,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Learning <span className="gradient-text">Progress</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Your topic progress and quiz results are saved in this browser — no account required.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">
            {startedTopics}/{topics.length} topics
          </Badge>
          {headlineAverage !== null && (
            <Badge variant="purple">
              {averageAttemptScore !== null ? 'Avg attempt' : 'Avg best'} {headlineAverage}%
            </Badge>
          )}
        </div>
      </div>

      {noActivity && (
        <Alert type="info" title="Your progress will appear here">
          Visit a topic or take a quiz to start tracking your learning. Progress is stored locally in
          this browser, so it stays private and does not need Supabase.
        </Alert>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="!p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Overall completion</CardTitle>
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {overall}% complete
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressBar value={overall} size="lg" showLabel={false} />
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-green-500" /> {startedTopics} topics started
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy size={14} className="text-yellow-500" />
              {attemptCount > 0
                ? `${attemptCount} quiz attempt${attemptCount === 1 ? '' : 's'} recorded`
                : `${scoreEntries.length} best score${scoreEntries.length === 1 ? '' : 's'} saved`}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Topic progress</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Open a topic to keep building its progress bar.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {topics.map(topic => {
                const progress = getTopicProgress(topic.id);
                const score = quizScores[topic.id];
                const topicAttempts = quizHistory.filter(attempt => attempt.topicId === topic.id);
                const latestAttempt = topicAttempts[0];

                return (
                  <Link
                    key={topic.id}
                    to={`/topics/${topic.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <span className="text-xl flex-shrink-0">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                          {topic.title}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {score !== undefined && (
                            <Badge
                              variant={score >= 80 ? 'green' : score >= 50 ? 'yellow' : 'red'}
                              size="sm"
                            >
                              Quiz {score}%
                            </Badge>
                          )}
                          <span className="text-xs text-slate-500">{progress}%</span>
                        </div>
                      </div>
                      <ProgressBar value={progress} size="sm" />
                      {topicAttempts.length > 0 && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {topicAttempts.length} attempt{topicAttempts.length === 1 ? '' : 's'}
                          {latestAttempt ? ` · last ${latestAttempt.percentage}%` : ''}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best scores by topic</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your highest saved score for each quiz.
            </p>
          </CardHeader>
          <CardContent>
            {orderedResults.length === 0 ? (
              <div className="text-center py-6">
                <Trophy size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No quiz results yet
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Take the mixed quiz to see your scores here.
                </p>
                <Link to="/quiz" className="btn-primary inline-flex items-center gap-2 text-sm">
                  <Target size={14} /> Take a quiz
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {orderedResults.map(([id, score]) => {
                  const meta = getScoreMeta(score);
                  const topic = topics.find(item => item.id === id);

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {topic?.icon} {getQuizLabel(id)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{meta.message}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xl font-extrabold ${meta.textColor}`}>{score}%</p>
                        <Badge variant={meta.variant} size="sm">
                          {meta.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Recent quiz attempts</CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {attemptCount > 0
                  ? `Your latest ${Math.min(attemptCount, 10)} of ${attemptCount} recorded attempt${attemptCount === 1 ? '' : 's'}.`
                  : 'Finish a quiz to start building your attempt history.'}
              </p>
            </div>
            <Badge variant="slate">{attemptCount} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {recentAttempts.length === 0 ? (
            <div className="text-center py-6">
              <History size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No attempts recorded yet
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Finish a quiz and it will appear here with its score and date.
              </p>
              {scoreEntries.length > 0 && (
                <p className="text-xs text-slate-500 mb-4">
                  Earlier best scores are still saved above.
                </p>
              )}
              <Link to="/quiz" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Target size={14} /> Take a quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAttempts.map(attempt => {
                const meta = getScoreMeta(attempt.percentage);
                const topic = topics.find(item => item.id === attempt.topicId);
                const label = attempt.topicId === 'mixed'
                  ? 'Mixed Practice'
                  : (topic?.title ?? attempt.topicId);
                const retryPath = attempt.topicId === 'mixed' ? '/quiz' : `/quiz/${attempt.topicId}`;

                return (
                  <div
                    key={attempt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xl flex-shrink-0">{topic?.icon ?? '🎯'}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {attempt.correctAnswers}/{attempt.totalQuestions} correct · {formatAttemptDate(attempt.completedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className={`text-lg font-extrabold ${meta.textColor}`}>{attempt.percentage}%</p>
                        <Badge variant={meta.variant} size="sm">
                          {meta.label}
                        </Badge>
                      </div>
                      <Link
                        to={retryPath}
                        className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label={`Retry ${label}`}
                        title={`Retry ${label}`}
                      >
                        <RotateCcw size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Suggested next steps</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Start with the topics where you have made the least progress.
            </p>
          </CardHeader>
          <CardContent>
            {nextTopics.length === 0 ? (
              <Alert type="success" title="All topics complete">
                You have reached 100% on every topic. Keep it fresh with a mixed quiz.
              </Alert>
            ) : (
              <div className="space-y-2">
                {nextTopics.map(topic => (
                  <Link
                    key={topic.id}
                    to={`/topics/${topic.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                  >
                    <span className="text-xl">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {topic.title}
                      </p>
                      <ProgressBar value={getTopicProgress(topic.id)} size="sm" className="mt-1" />
                    </div>
                    <ArrowRight size={14} className="flex-shrink-0 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card gradient>
          <CardHeader>
            <CardTitle>Keep the momentum going</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link
                to="/quiz"
                className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/70 transition-colors group"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">🎯 Mixed quiz</p>
                  <p className="text-xs text-slate-500">15 questions across all topics</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-500" />
              </Link>
              <Link
                to="/revision"
                className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/70 transition-colors group"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <FileText size={13} className="inline mr-1" /> Revision notes
                  </p>
                  <p className="text-xs text-slate-500">Seven slides and a checklist</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-500" />
              </Link>
              <Link
                to="/complexity"
                className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/70 transition-colors group"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">📈 Complexity sheet</p>
                  <p className="text-xs text-slate-500">Time and space cheat sheet</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-500" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
