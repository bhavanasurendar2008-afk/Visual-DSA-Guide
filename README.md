# DSA Visual Study Guide

An interactive study guide for Data Structures and Algorithms, built for second-year CSE students revising for placements and exams. Every topic pairs a hands-on visualization with an explanation, reference Python and C++ implementations, a quiz, and revision notes.

Built with **React 18 + TypeScript + Vite**, styled with **Tailwind CSS**, routed with **React Router 6**.

---

## Features

- **8 topics** — Arrays, Linked Lists, Stacks, Queues, Trees & BST, Graphs, Sorting Algorithms, Big-O Notation.
- **Interactive visualizations** — linear search/insert/delete on arrays, linked-list insert front/end and delete, stack push/pop/peek, queue enqueue/dequeue, BST insert and animated in-order traversal, animated BFS and DFS, step-by-step bubble/selection/insertion sort with play/pause, and a Big-O growth-rate chart with complexity tables.
- **Tabbed topic content** — Visualization, Explanation, Python, and C++ (syntax-highlighted, with a copy button). Big-O uses Charts + Explanation instead of a code view.
- **Quizzes** — 20 multiple-choice questions with instant feedback and an explanation for every answer. Each topic has its own quiz, plus a 15-question mixed practice quiz. Results include a full answer review.
- **Revision notes** — 7 compact slides plus an 8-item "I can explain…" checklist that persists.
- **Complexity cheat sheets** — data-structure and sorting complexity tables, plus the growth-rate chart.
- **Progress tracking** — per-topic progress bars, best score per quiz, and a history of your last 50 quiz attempts with dates and scores.
- **Search and filters** — navbar search with `?q=` deep links, category filters, and an empty state.
- **Dark/light theme** — follows your OS by default, remembers your choice.
- **Responsive** — collapsible sidebar drawer on mobile.
- **Friendly 404** — unknown URLs show a helpful page instead of a blank screen.

---

## Requirements

- **Node.js 18 or newer** (developed and tested on Node 24)
- **npm** (ships with Node)

No database, account, or API key is required — all content and state live in the browser (only the Google Fonts stylesheet is fetched from the network).

---

## Setup

```bash
# 1. Install dependencies (once)
npm install

# 2. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser. Stop the server with `Ctrl+C`.

### Production build

```bash
npm run build     # type-checks with tsc, then bundles into dist/
npm run preview   # serves the built app at http://localhost:4173
```

`dist/` is generated output and should not be committed or edited by hand.

---

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with hot reload on port 5173. |
| `npm run build` | Runs `tsc` for type-checking, then builds the production bundle into `dist/`. |
| `npm run preview` | Serves the production build locally on port 4173. Use this to check the real bundle. |
| `npm run lint` | Runs ESLint with `--max-warnings 0`. **Currently not configured** — the repository has no ESLint config file, so this exits with a configuration error until one is added. |
| `npm test` | Runs Vitest. **No test files exist yet**, so it exits with "No test files found" — treat this as not configured, not as a pass. |

---

## Project structure

```
dsa-visual-guide/
├── index.html                  # Vite HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite + React plugin, "@" alias to ./src
├── tsconfig.json               # TypeScript config for the app
├── tsconfig.node.json          # TypeScript config for vite.config.ts
├── tailwind.config.js          # Theme colors, fonts, animations
├── postcss.config.js           # Tailwind + autoprefixer
├── .env.example                # Template for the optional Supabase variables
├── .gitignore                  # Ignores node_modules, dist, real .env files
├── public/
│   └── favicon.svg
├── supabase/
│   └── migrations/             # Empty placeholder — no schema is applied yet
└── src/
    ├── main.tsx                # React root
    ├── App.tsx                 # All routes (including the 404 catch-all)
    ├── index.css               # Tailwind layers, component classes, animations
    ├── vite-env.d.ts
    ├── components/
    │   ├── layout/             # AppLayout, Navbar (search, theme), Sidebar (nav, drawer)
    │   ├── ui/                 # Alert, Badge, Card, CodeBlock, ProgressBar, TabGroup
    │   └── visualizations/     # ArraysViz, LinkedListViz, StackViz, QueueViz,
    │                           # TreeViz, GraphViz, SortingViz, BigOViz
    ├── data/
    │   ├── topics.ts           # The 8 topics (title, slug, category, tags, time)
    │   ├── quiz.ts             # 20 quiz questions with explanations
    │   └── complexity.ts       # Complexity tables and Big-O reference data
    ├── hooks/
    │   ├── useProgress.ts      # Topic progress, best scores, attempt history
    │   └── useTheme.ts         # Dark/light theme with OS default
    ├── lib/
    │   ├── utils.ts            # cn() class merge helper, complexity colors
    │   └── supabase.ts         # Optional Supabase client (null until configured)
    ├── pages/
    │   ├── LandingPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── TopicsPage.tsx
    │   ├── TopicDetailPage.tsx # Maps slug → visualization component
    │   ├── QuizPage.tsx        # Mixed quiz and per-topic quiz
    │   ├── RevisionPage.tsx
    │   ├── ComplexityPage.tsx
    │   ├── ProgressPage.tsx
    │   └── NotFoundPage.tsx
    └── types/
        └── index.ts            # Topic, QuizQuestion, QuizHistoryEntry, etc.
```

---

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/dashboard` | Overview: progress, best score, quick actions |
| `/topics` | All 8 topics, search (`?q=`) and category filter |
| `/topics/:slug` | Topic detail: visualization, explanation, Python, C++ |
| `/quiz` | 15-question mixed practice quiz |
| `/quiz/:topicId` | Per-topic quiz (2–3 questions) |
| `/revision` | Revision notes + checklist |
| `/complexity` | Complexity cheat sheets |
| `/progress` | Progress, best scores, recent attempts |
| anything else | 404 page |

---

## Where your data lives

There is no backend. Everything is stored in the browser's `localStorage`, so progress is per-browser and per-device, and clearing site data resets it.

| Key | Contents |
| --- | --- |
| `dsa-progress` | Per-topic completion percentage (`25` once a topic is opened) |
| `dsa-quiz-scores` | Best percentage per quiz |
| `dsa-quiz-history` | Last 50 quiz attempts (topic, correct/total, percentage, ISO timestamp) |
| `dsa-revision-checklist` | Which revision checklist items are ticked |
| `dsa-theme` | `light` or `dark` |

Malformed or missing values are handled gracefully — the app falls back to an empty state instead of crashing.

---

## Optional: connecting Supabase

The app ships with a ready-but-unused Supabase client so progress can later sync across devices. **Nothing is connected today**; without the environment variables below the app behaves exactly as described above.

1. Create a project at [supabase.com](https://supabase.com) and copy the **Project URL** and **anon public key** from *Project Settings → API*.
2. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
3. Fill in the values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Restart `npm run dev` — Vite only reads env files at startup.

Then `src/lib/supabase.ts` exposes:

```ts
import { supabase, isSupabaseConfigured } from './lib/supabase';

if (isSupabaseConfigured && supabase) {
  // e.g. supabase.from('quiz_attempts').select()
}
```

**Security notes**

- Only ever put the **anon public key** in a `VITE_` variable — Vite inlines them into the served JavaScript, so anything there is public.
- Never put a **service-role** key in the frontend.
- `.env` is git-ignored (`!.env.example` is kept as the template).
- Enable Row Level Security on every table and scope rows by `auth.uid()`.

`supabase/migrations/` is currently empty because no schema is applied yet. A minimal starting point for storing quiz attempts, if you add auth later:

```sql
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null,
  correct_answers int not null check (correct_answers >= 0),
  total_questions int not null check (total_questions > 0),
  percentage int not null check (percentage between 0 and 100),
  completed_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

create policy "Users read their own attempts"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users insert their own attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);
```

This table is **not** used by the current code — the UI still reads from `localStorage`.

---

## Adding content

- **New topic:** add an entry to `src/data/topics.ts`, build a visualization component in `src/components/visualizations/`, and register it in the `topicComponents` map in `src/pages/TopicDetailPage.tsx`.
- **New quiz question:** append to `src/data/quiz.ts` with a unique `id`, a `topicId` matching `topics.ts`, four `options`, a valid `correctIndex`, and an `explanation`. Questions shorter than two options or with an out-of-range answer are filtered out automatically.
- **New complexity row:** extend `dsaComplexityTable` or `sortingComplexityTable` in `src/data/complexity.ts`.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Port 5173 is already in use` | Stop the other dev server, or run `npm run dev -- --port 5174`. |
| Blank page after opening `dist/index.html` directly | Don't open the file directly; serve it with `npm run preview` (or any static server) so module scripts and routing work. |
| Deep links like `/topics/arrays` 404 when hosted | The app is a single-page app. Configure your host to rewrite unknown paths to `index.html`. `vite preview` already does this. |
| Changes to `.env` are ignored | Restart the dev server; env vars are read at startup. |
| Progress disappeared | Data is per browser and per origin. Clearing site data, private windows, or switching between `localhost:5173` and `localhost:4173` starts a separate store. |

---

## Known limitations

- Progress, scores, and checklist state are stored in `localStorage` only — no accounts and no cross-device sync (Supabase is scaffolded but not wired up).
- An in-progress quiz is not saved; reloading restarts the quiz.
- The question bank has 20 questions (2–3 per topic), so topics repeat questions on retry.
- The Sorting topic's description mentions five algorithms, but the visualizer implements three (bubble, selection, insertion).
- The revision page reopens on the "Revision notes" tab after a reload, although checklist ticks are preserved.
- No automated tests and no ESLint config yet, so `npm test` and `npm run lint` are not usable as quality gates.

---

## Verification status

- `npm run build` completes with no TypeScript or bundling errors.
- All pages, all 8 visualizations, the mixed and per-topic quizzes, revision checklist persistence, progress history, search/filter, mobile drawer, both themes, and the 404 page were exercised manually in a browser against both the dev server and the production preview.
