/**
 * Captioned video tours of the desktop app (public/videos). Each one was recorded from MotionQL 1.2 driving
 * the real app against sample data; the poster is a frame from the video.
 */
export type VideoTour = {
  slug: string;
  title: string;
  summary: string;
  /** Length in seconds. */
  seconds: number;
  /** Feature pages (lib/features.ts) that show this video. */
  features: string[];
};

export const videos: VideoTour[] = [
  {
    slug: "01-core-tour",
    title: "Connect, browse and query",
    summary: "Add a connection, browse the sidebar, switch between tree, table and JSON, and filter and sort results.",
    seconds: 92,
    features: ["connections-security"],
  },
  {
    slug: "02-query-builder",
    title: "Build queries without writing JSON",
    summary: "Point and click a filter, run it, and see how MongoDB ran it.",
    seconds: 100,
    features: ["visual-query-builder"],
  },
  {
    slug: "03-aggregation",
    title: "Aggregations you can see",
    summary: "Build a revenue-per-product pipeline one stage at a time, with each stage's output on screen.",
    seconds: 73,
    features: ["aggregation-pipeline-builder"],
  },
  {
    slug: "04-shell-sql",
    title: "A shell and SQL, built in",
    summary: "IntelliShell autocompletes MongoDB commands, and SELECT works when you think in SQL.",
    seconds: 81,
    features: ["intellishell", "sql-query"],
  },
  {
    slug: "05-editing",
    title: "Edit documents your way",
    summary: "Edit inline, in the full editor or in bulk, find any value, and roll back with document history.",
    seconds: 110,
    features: [],
  },
  {
    slug: "06-schema",
    title: "See and shape your schema",
    summary: "Schema analysis, the data model, schema drift and data masking.",
    seconds: 87,
    features: ["schema-analysis-er-diagram", "schema-compare", "data-masking-reschema"],
  },
  {
    slug: "07-data-movement",
    title: "Move data in and out",
    summary: "Export, import with column mapping, copy collections, compare and sync, and generate test data.",
    seconds: 113,
    features: ["import-export", "compare-sync", "test-data-generator"],
  },
  {
    slug: "08-performance",
    title: "Find slow queries and fix them",
    summary: "The query profiler, index advice and live server monitoring.",
    seconds: 134,
    features: ["query-profiler-explain", "index-management"],
  },
  {
    slug: "09-charts-dashboards",
    title: "Turn your data into dashboards",
    summary: "Charts, metrics and filters on live MongoDB data.",
    seconds: 96,
    features: ["charts-dashboards"],
  },
  {
    slug: "10-workspace",
    title: "A workspace that keeps up with you",
    summary: "Split panes, live change streams, scheduled tasks and more.",
    seconds: 122,
    features: ["fast-workspace", "tasks-scheduling"],
  },
  {
    slug: "11-ai",
    title: "Your AI assistant, powered by Gemini",
    summary: "Bring your own free Gemini key, then ask in plain English for queries, explain plans, pipelines and masking rules.",
    seconds: 146,
    features: ["ai-assistant-mcp"],
  },
  {
    slug: "13-ai-everywhere",
    title: "AI on every screen",
    summary: "Dashboards from one sentence, slow-query explanations, PII detection, shell help, index verdicts and test data.",
    seconds: 131,
    features: ["ai-assistant-mcp"],
  },
  {
    slug: "12-sql-databases",
    title: "PostgreSQL and MySQL, right next to MongoDB",
    summary: "Browse, edit and query SQL databases, then migrate tables into MongoDB documents.",
    seconds: 125,
    features: ["sql-databases", "sql-migration"],
  },
];

export const videosForFeature = (slug: string) => videos.filter((v) => v.features.includes(slug));

export const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
