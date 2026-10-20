import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Trophy, ExternalLink } from 'lucide-react';
import { getTopicBySlug } from '../data/topics';
import { useProgress } from '../hooks/useProgress';
import { Badge } from '../components/ui/Badge';
import { TabGroup } from '../components/ui/TabGroup';
import { CodeBlock } from '../components/ui/CodeBlock';
import { Alert } from '../components/ui/Alert';
import { ProgressBar } from '../components/ui/ProgressBar';

// Topic-specific content and visualizations
import { ArraysContent } from '../components/visualizations/ArraysViz';
import { LinkedListContent } from '../components/visualizations/LinkedListViz';
import { StackContent } from '../components/visualizations/StackViz';
import { QueueContent } from '../components/visualizations/QueueViz';
import { TreeContent } from '../components/visualizations/TreeViz';
import { GraphContent } from '../components/visualizations/GraphViz';
import { SortingContent } from '../components/visualizations/SortingViz';
import { BigOContent } from '../components/visualizations/BigOViz';

const topicComponents: Record<string, React.ComponentType> = {
  arrays: ArraysContent,
  'linked-lists': LinkedListContent,
  stacks: StackContent,
  queues: QueueContent,
  trees: TreeContent,
  graphs: GraphContent,
  sorting: SortingContent,
  'big-o': BigOContent,
};

export function TopicDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? getTopicBySlug(slug) : null;
  const { markTopicVisited, getTopicProgress } = useProgress();

  useEffect(() => {
    if (topic) {
      markTopicVisited(topic.id);
      document.title = `${topic.title} — DSA Visual Guide`;
    }
    return () => { document.title = 'DSA Visual Study Guide'; };
  }, [topic?.id]);

  if (!topic || !slug) return <Navigate to="/topics" replace />;

  const TopicComponent = topicComponents[slug];
  const prog = getTopicProgress(topic.id);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/topics" className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Topics
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{topic.title}</span>
      </div>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="text-5xl">{topic.icon}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={topic.difficulty === 'beginner' ? 'green' : topic.difficulty === 'intermediate' ? 'yellow' : 'red'}>
                {topic.difficulty}
              </Badge>
              <Badge variant="slate">
                <Clock size={11} className="mr-1" /> {topic.estimatedTime} min
              </Badge>
              <Badge variant="primary">{topic.category.replace('-', ' ')}</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{topic.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{topic.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {topic.tags.map(tag => (
                <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {prog > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <ProgressBar value={prog} showLabel size="md" />
          </div>
        )}
      </div>

      {/* Main content */}
      {TopicComponent ? (
        <TopicComponent />
      ) : (
        <Alert type="warning">Content for this topic is being prepared. Check back soon!</Alert>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link to="/topics" className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={16} /> All Topics
        </Link>
        <Link to={`/quiz/${topic.id}`} className="btn-primary flex items-center gap-2">
          <Trophy size={16} /> Quiz on {topic.title}
        </Link>
      </div>
    </div>
  );
}
