import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, RotateCcw } from 'lucide-react';
import { revisionSlides } from '../data/complexity';
import { topics } from '../data/topics';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TabGroup } from '../components/ui/TabGroup';
import { cn } from '../lib/utils';

const CHECKLIST_STORAGE_KEY = 'dsa-revision-checklist';

const checklistItems = topics.map(topic => ({
  id: topic.id,
  icon: topic.icon,
  label: `I can explain ${topic.title} and its core operations`,
}));

function loadChecklist(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const result: Record<string, boolean> = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
      if (value === true) result[key] = true;
    });
    return result;
  } catch {
    return {};
  }
}

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderTable(rows: string[][], key: string) {
  if (rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div key={key} className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            {header.map((cell, index) => (
              <th key={index} className="p-2.5 text-left font-semibold text-slate-700 dark:text-slate-300">
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-800/20' : 'bg-slate-50 dark:bg-slate-800/50'}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-2.5 text-slate-600 dark:text-slate-400">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NoteContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    blocks.push(renderTable(tableRows, `table-${blocks.length}`));
    tableRows = [];
  };

  content.split('\n').forEach((line, lineIndex) => {
    const trimmed = line.trim();
    const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');

    if (isTableRow) {
      const cells = trimmed.slice(1, -1).split('|').map(cell => cell.trim());
      const isSeparator = cells.every(cell => /^:?-{3,}:?$/.test(cell));
      if (!isSeparator) tableRows.push(cells);
      return;
    }

    flushTable();

    if (!trimmed) {
      blocks.push(<div key={`space-${lineIndex}`} className="h-2" />);
      return;
    }

    const isBullet = trimmed.startsWith('- ');
    const text = isBullet ? trimmed.slice(2) : trimmed;

    blocks.push(
      <div
        key={`line-${lineIndex}`}
        className={cn('text-sm leading-relaxed text-slate-600 dark:text-slate-400', isBullet && 'flex gap-2 pl-2')}
      >
        {isBullet && <span className="text-primary-500 font-bold">•</span>}
        <p>{renderInline(text)}</p>
      </div>,
    );
  });

  flushTable();

  return <div className="space-y-1">{blocks}</div>;
}

export function RevisionPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecklist);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // localStorage can be unavailable in private browsing; the page still works in memory.
    }
  }, [checked]);

  const checkedCount = checklistItems.filter(item => checked[item.id]).length;
  const checklistPercentage = checklistItems.length > 0
    ? Math.round((checkedCount / checklistItems.length) * 100)
    : 0;

  const toggleItem = (id: string) => {
    setChecked(previous => ({ ...previous, [id]: !previous[id] }));
  };

  const notesContent = (
    <div className="space-y-5">
      {revisionSlides.length === 0 ? (
        <Alert type="warning" title="No revision notes found">
          Revision notes have not been added yet. You can still take a quiz or browse the topics.
        </Alert>
      ) : (
        revisionSlides.map((slide, index) => (
          <Card key={slide.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="primary" size="sm">Slide {index + 1}</Badge>
                    <Badge variant="slate" size="sm">Quick revision</Badge>
                  </div>
                  <CardTitle>{slide.title}</CardTitle>
                </div>
                <FileText size={18} className="flex-shrink-0 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <NoteContent content={slide.content} />
              {slide.code && (
                <CodeBlock
                  code={slide.code}
                  language={slide.language || 'python'}
                  title={`Slide ${index + 1} — code`}
                />
              )}
              {slide.tip && (
                <Alert type="tip" title="Exam tip">
                  {slide.tip}
                </Alert>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const checklistContent = (
    <div className="space-y-4">
      {checklistItems.length === 0 ? (
        <Alert type="warning" title="No checklist items available">
          Topics have not been added yet, so there is nothing to check off.
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Revision checklist</CardTitle>
              <Badge variant={checklistPercentage === 100 ? 'green' : 'primary'}>
                {checkedCount}/{checklistItems.length} complete
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tick each topic once you can explain it without looking at your notes. Your checklist is
              saved in this browser.
            </p>
          </CardHeader>
          <CardContent>
            <ProgressBar value={checklistPercentage} showLabel className="mb-5" />

            <div className="space-y-2">
              {checklistItems.map(item => {
                const isChecked = Boolean(checked[item.id]);
                return (
                  <label
                    key={item.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                      isChecked
                        ? 'border-green-300 bg-green-50 dark:border-green-700/50 dark:bg-green-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item.id)}
                      className="h-4 w-4 flex-shrink-0 accent-primary-600"
                    />
                    <span className="text-xl">{item.icon}</span>
                    <span
                      className={cn(
                        'flex-1 text-sm font-medium',
                        isChecked
                          ? 'text-slate-500 line-through dark:text-slate-400'
                          : 'text-slate-700 dark:text-slate-300',
                      )}
                    >
                      {item.label}
                    </span>
                    {isChecked && <CheckCircle2 size={16} className="flex-shrink-0 text-green-500" />}
                  </label>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setChecked({})}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <RotateCcw size={14} /> Reset checklist
              </button>
              <Link to="/quiz" className="btn-primary inline-flex items-center gap-2 text-sm">
                Test yourself <ArrowRight size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Revision <span className="gradient-text">Notes</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Seven compact slides and a topic checklist for last-minute exam revision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">{revisionSlides.length} slides</Badge>
          <Badge variant={checklistPercentage === 100 ? 'green' : 'slate'}>
            {checkedCount}/{checklistItems.length} checked
          </Badge>
        </div>
      </div>

      <Alert type="tip" title="How to revise">
        Read one slide, say the key idea out loud in your own words, then tick the matching topic in the
        checklist. Finish with a quiz to check what stuck.
      </Alert>

      <TabGroup
        tabs={[
          { id: 'notes', label: '📖 Revision notes', content: notesContent },
          { id: 'checklist', label: '✅ Checklist', content: checklistContent },
        ]}
      />
    </div>
  );
}
