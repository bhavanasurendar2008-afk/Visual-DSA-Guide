import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { topics } from '../data/topics';
import { useProgress } from '../hooks/useProgress';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

const categories = ['all', 'data-structures', 'algorithms', 'complexity'] as const;

export function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState<string>('all');
  const { getTopicProgress } = useProgress();

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set('q', value);
    else params.delete('q');
    setSearchParams(params, { replace: true });
  };

  const filtered = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    const matchesCat = category === 'all' || t.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">DSA Topics</h1>
        <p className="text-slate-500 dark:text-slate-400">Browse all 8 topics with interactive visualizations and explanations</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search topics or tags..."
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary-300'
              }`}
            >
              {cat === 'all' ? 'All' : cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Topics grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No topics found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {filtered.map(topic => {
            const prog = getTopicProgress(topic.id);
            return (
              <Link
                key={topic.id}
                to={`/topics/${topic.slug}`}
                className="card p-6 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700/50 transition-all duration-200 hover:-translate-y-0.5 group block"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{topic.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {topic.title}
                      </h3>
                      <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-500 flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                      {topic.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant={topic.difficulty === 'beginner' ? 'green' : topic.difficulty === 'intermediate' ? 'yellow' : 'red'}>
                        {topic.difficulty}
                      </Badge>
                      <Badge variant="slate">
                        <Clock size={11} className="mr-1" /> {topic.estimatedTime} min
                      </Badge>
                      <Badge variant="primary" size="sm">
                        {topic.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {topic.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ProgressBar value={prog} size="sm" showLabel={prog > 0} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
