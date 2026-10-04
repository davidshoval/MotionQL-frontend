// Blog posts. Bodies are Markdown files in content/blog/<slug>.md. Product facts in posts come from the desktop
// app's CHANGELOG and docs; comparisons link to /compare, whose claims are sourced in src/lib/content.ts.
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  author: string;
  tags: string[];
}

const posts: BlogPost[] = [
  {
    slug: "motionql-1-0-free-studio-3t-alternative",
    title: "MotionQL 1.0: a free Studio 3T alternative",
    description:
      "MotionQL 1.0 is out for macOS and Windows: a full MongoDB IDE with a visual query builder, aggregation editor, SQL, Compare and Sync, and a free Pro license for your first year.",
    date: "2026-10-03",
    author: "The MotionQL team",
    tags: ["Release"],
  },
  {
    slug: "move-from-studio-3t-or-compass",
    title: "How to move from Studio 3T or Compass to MotionQL",
    description:
      "A practical checklist for switching MongoDB GUIs: connections, saved queries, shell scripts, tasks and the shortcuts you'll reach for first.",
    date: "2026-10-04",
    author: "The MotionQL team",
    tags: ["Guide"],
  },
  {
    slug: "reading-mongodb-explain-plans",
    title: "Reading MongoDB explain plans: COLLSCAN vs IXSCAN",
    description:
      "What the stages in a MongoDB explain plan mean, how to tell a collection scan from an index scan, and how to fix the query once you know.",
    date: "2026-10-04",
    author: "The MotionQL team",
    tags: ["MongoDB", "Performance"],
  },
];

/** Newest first. */
export const blogPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export async function readPostSource(slug: string) {
  return readFile(path.join(process.cwd(), "content/blog", `${slug}.md`), "utf8");
}

export function readingMinutes(source: string) {
  return Math.max(1, Math.round(source.split(/\s+/).length / 220));
}
