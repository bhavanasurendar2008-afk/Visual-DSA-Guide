import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Trophy, BookOpen, TrendingUp, Flame, Target } from 'lucide-react';
import { topics } from '../data/topics';
import { useProgress } from '../hooks/useProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getDifficultyColor, formatTime } from '../lib/utils';

const dailyConcepts = [
  { concept: 'Binary Search', description: 'Finds an element in a sorted array in O(log n) time by repeatedly halving the search space.', topic: 'arrays' },
  { concept: 'Stack Overflow', description: 'Occurs when recursive calls exceed the call stack limit. Always define a base case!', topic: 'stacks' },
  { concept: 'BFS vs DFS', description: 'BFS uses a queue and finds shortest paths. DFS uses a stack and explores deep paths first.', topic: 'graphs' },
  { concept: 'BST In-order = Sorted', description: 'In-order traversal of a BST always produces elements in ascending sorted order.', topic: 'trees' },
  { concept: 'Merge Sort Stability', description: 'Merge Sort is stable — equal elements maintain their original relative order after sorting.', topic: 'sorting' },
  { concept: 'O(1) vs O(n) Space', description: 'Sorting algorithms like Bubble Sort use O(1) space. Merge Sort needs O(n) auxiliary space.', topic: 'big-o' },
  { concept: 'Circular Queue', description: 'Circular queues reuse vacated front positions using modular arithmetic: (i+1) % n.', topic: 'queues' },
];

export function DashboardPage() {
  const { progress, quizScores, overallProgress, getTopicProgress, getQuizScore } = useProgress();
  const daily = dailyConcepts[new Date().getDay()];
  const overall = overallProgress();

  const visitedTopics = topics.filter(t => getTopicProgress(t.id) > 0).length;
  const bestScore = Math.max(0, ...Object.values(quizScores));

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Continue your DSA journey — you're doing great!
          </p>
        </div>
        <Link to="/quiz" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Target size={16} />
          Take Quiz
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${overall}%`, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
          { label: 'Topics Visited', value: `${visitedTopics}/${topics.length}`, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Best Quiz Score', value: bestScore > 0 ? `${bestScore}%` : '–', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Topics Available', value: '8', icon: Flame, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* Overall progress bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Learning Progress</CardTitle>
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{overall}% complete</span>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressBar value={overall} size="lg" showLabel={false} className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topics.map(topic => {
              const prog = getTopicProgress(topic.id);
              return (
                <Link
                  key={topic.id}
                  to={`/topics/${topic.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                >
                  <span className="text-xl">{topic.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {topic.title}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">{prog}%</span>
                    </div>
                    <ProgressBar value={prog} size="sm" />
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-500 flex-shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily concept + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Concept */}
        <Card gradient>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <CardTitle>Today's Concept</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{daily.concept}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{daily.description}</p>
            <Link
              to={`/topics/${daily.topic}`}
              className="btn-primary text-sm py-2 inline-flex items-center gap-2"
            >
              Learn more <ArrowRight size={14} />
            </Link>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: '📚 All Topics', desc: 'Browse all 8 DSA topics', path: '/topics' },
                { label: '🎯 Practice Quiz', desc: '20+ questions with explanations', path: '/quiz' },
                { label: '📖 Revision Slides', desc: '7 slides for quick review', path: '/revision' },
                { label: '📈 Complexity Chart', desc: 'Big-O comparison & cheat sheet', path: '/complexity' },
              ].map(({ label, desc, path }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic cards grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">All Topics</h2>
          <Link to="/topics" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map(topic => {
            const prog = getTopicProgress(topic.id);
            const score = getQuizScore(topic.id);
            return (
              <Link
                key={topic.id}
                to={`/topics/${topic.slug}`}
                className="card p-5 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 hover:-translate-y-0.5 group block"
              >
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{topic.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={topic.difficulty === 'beginner' ? 'green' : topic.difficulty === 'intermediate' ? 'yellow' : 'red'} size="sm">
                    {topic.difficulty}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={11} /> {topic.estimatedTime}m
                  </span>
                </div>
                <ProgressBar value={prog} size="sm" />
                {score > 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
                    <Trophy size={11} /> Quiz: {score}%
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
