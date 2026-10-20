import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Zap, Brain, BarChart2, CheckSquare, BookOpen, Code2, TrendingUp } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { topics } from '../data/topics';

const features = [
  { icon: Play, title: 'Interactive Visualizations', desc: 'Watch algorithms run step-by-step with Play, Pause, Reset, and Step controls.', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  { icon: Brain, title: 'AI-Style Explanations', desc: 'Built-in plain-language explanations for every concept, with real-world analogies.', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
  { icon: Star, title: 'Quiz & Practice', desc: '20+ multiple-choice questions with instant feedback, explanations, and scoring.', color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' },
  { icon: TrendingUp, title: 'Progress Tracking', desc: 'Track which topics you have studied and your quiz high scores at a glance.', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
  { icon: BarChart2, title: 'Complexity Charts', desc: 'Compare Big-O classes with interactive growth charts and cheat sheets.', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
  { icon: CheckSquare, title: 'Revision Slides', desc: 'Seven slides summarising every major DSA concept — perfect for last-minute revision.', color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30' },
];

const stats = [
  { value: '8', label: 'DSA Topics' },
  { value: '20+', label: 'Quiz Questions' },
  { value: '7', label: 'Revision Slides' },
  { value: '5', label: 'Sorting Algorithms' },
];

export function LandingPage() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 text-white overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">DSA <span className="gradient-text">Visual</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
            {isDark ? '☀️' : '🌙'}
          </button>
          <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">
            Enter App →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center">
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-900/60 border border-primary-600/40 rounded-full px-4 py-2 text-sm text-primary-300 mb-8">
            <Zap size={14} />
            Built for CSE students preparing for placements &amp; exams
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="block">Master</span>
            <span className="gradient-text">Data Structures</span>
            <span className="block text-slate-300">&amp; Algorithms</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Interactive visualizations, step-by-step explanations, quizzes, complexity analysis,
            and revision notes — everything a second-year CS student needs to ace DSA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
            >
              🚀 Start Learning
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/quiz"
              className="flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300"
            >
              <Play size={18} />
              Take a Quiz
            </Link>
          </div>
        </div>

        {/* Hero visual — animated graph nodes */}
        <div className="relative mt-16 max-w-2xl mx-auto">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-slate-400 font-mono">binary_search.py</span>
            </div>
            <pre className="text-sm font-mono text-slate-300 leading-relaxed">
              <span className="text-pink-400">def</span>{' '}
              <span className="text-blue-400">binary_search</span>
              <span className="text-white">(arr, target):</span>
              {`\n    `}<span className="text-orange-400">left</span>, <span className="text-orange-400">right</span> = <span className="text-green-400">0</span>, len(arr) - <span className="text-green-400">1</span>
              {`\n    `}<span className="text-pink-400">while</span> left &lt;= right:
              {`\n        `}<span className="text-orange-400">mid</span> = (left + right) // <span className="text-green-400">2</span>
              {`\n        `}<span className="text-pink-400">if</span> arr[mid] == target:
              {`\n            `}<span className="text-pink-400">return</span> mid  <span className="text-slate-500"># O(log n)</span>
            </pre>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/10 bg-white/5 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold gradient-text">{value}</div>
              <div className="text-sm text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything you need to <span className="gradient-text">ace DSA</span></h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">One platform covering all topics, visualizations, quizzes, and revision materials for your exam and placement preparation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary-500/40 hover:bg-white/8 transition-all duration-300 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics preview */}
      <section className="py-16 px-6 bg-white/3">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">8 Complete <span className="gradient-text">DSA Modules</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topics.map(topic => (
              <Link
                key={topic.id}
                to={`/topics/${topic.slug}`}
                className="group bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300 text-center"
              >
                <div className="text-3xl mb-2">{topic.icon}</div>
                <div className="font-semibold text-sm text-white group-hover:text-primary-300 transition-colors">{topic.title}</div>
                <div className="text-xs text-slate-500 mt-1">{topic.estimatedTime} min</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-slate-500 text-sm">
        <p>DSA Visual Study Guide — Built for CSE students 🎓</p>
        <p className="mt-1">React + TypeScript + Tailwind CSS + Supabase</p>
      </footer>
    </div>
  );
}
