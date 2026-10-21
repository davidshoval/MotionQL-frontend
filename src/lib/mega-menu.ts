import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  CircleHelp,
  FileClock,
  Gauge,
  LifeBuoy,
  Map,
  MessageSquarePlus,
  Newspaper,
  PlayCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { features } from "@/lib/features";
import { databases, type DatabaseFamily } from "@/lib/databases";
import { vendors } from "@/lib/compare-vendors";

/**
 * The header's mega menu. Feature and database links come from their own lists (features.ts, databases.ts,
 * compare-vendors.ts) so names and slugs stay in sync; the one-line blurbs are shortened from each page's summary.
 */

export interface MenuLink {
  href: string;
  label: string;
  blurb?: string;
  icon?: LucideIcon;
}

export interface MenuColumn {
  title: string;
  links: MenuLink[];
}

export interface MenuFeatured {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: LucideIcon;
}

export interface MenuSection {
  label: string;
  /** Landing page for the section; also where the panel's footer link goes. */
  href: string;
  footer: string;
  columns: MenuColumn[];
  featured?: MenuFeatured;
}

function feature(slug: string, blurb: string): MenuLink {
  const f = features.find((x) => x.slug === slug);
  if (!f) throw new Error(`mega-menu: unknown feature ${slug}`);
  return { href: `/features/${f.slug}`, label: f.name, blurb, icon: f.icon };
}

function compare(slug: string, name?: string): MenuLink {
  const label = name ?? vendors[slug]?.name;
  if (!label) throw new Error(`mega-menu: unknown comparison ${slug}`);
  return { href: `/compare/${slug}`, label: `vs ${label}` };
}

const groups: DatabaseFamily["group"][] = [
  "Relational",
  "Document and key-value",
  "Analytics and warehouses",
  "Search, time series and graph",
];

export const megaMenu: MenuSection[] = [
  {
    label: "Product",
    href: "/features",
    footer: "All features",
    columns: [
      {
        title: "Every database",
        links: [
          feature("sql-databases", "Completion, inspections and a visual builder"),
          feature("logs-analytics", "Server logs, metrics and slow operations"),
          feature("ai-assistant-mcp", "Your own key or a local model"),
          feature("notebooks", "Queries, charts and notes in one tab"),
          feature("er-diagram-design", "Design tables and apply the DDL"),
        ],
      },
      {
        title: "Move and automate",
        links: [
          feature("sql-migration", "SQL to MongoDB and back to SQL"),
          feature("import-export", "Every common format, dump and restore"),
          feature("sql-data-tools", "Compare tables, back up, fill test data"),
          feature("tasks-scheduling", "Run jobs on a schedule or from a CLI"),
          feature("charts-dashboards", "Chart results, build live dashboards"),
        ],
      },
      {
        title: "For MongoDB",
        links: [
          feature("visual-query-builder", "Drag fields, nest AND / OR groups"),
          feature("aggregation-pipeline-builder", "See the documents after every stage"),
          feature("intellishell", "mongosh commands with autocomplete"),
          feature("compare-sync", "Diff collections, sync what you choose"),
          feature("index-management", "Find unused and missing indexes"),
        ],
      },
    ],
    featured: {
      eyebrow: "Video tours",
      title: "See MotionQL in action",
      body: "Short captioned tours of the real app, from the first connection to AI on every screen.",
      href: "/videos",
      cta: "Watch the tours",
      icon: PlayCircle,
    },
  },
  {
    label: "Databases",
    href: "/databases",
    footer: "All 60+ databases and services",
    columns: groups.map((g) => ({
      title: g,
      links: databases.filter((d) => d.group === g).map((d) => ({ href: `/databases/${d.slug}`, label: d.name })),
    })),
  },
  {
    label: "Teams",
    href: "/features/team-workspace",
    footer: "Team & workspace",
    columns: [
      {
        title: "Work together",
        links: [
          feature("team-workspace", "Files in Git or a self-hosted Team Server"),
          feature("projects-environments", "Dev, test, staging and prod, with policies"),
          feature("scripts-git", "Commit and push queries from the app"),
          feature("cross-database-links", "Relate records across databases"),
        ],
      },
      {
        title: "Trust and control",
        links: [
          { href: "/security", label: "Security", blurb: "Keychain secrets, enforced read-only, offline keys", icon: ShieldCheck },
          feature("connections-security", "SSH, TLS, cloud sign-in and safety policies"),
          { href: "/pricing", label: "Pricing", blurb: "Pro free for a year, team seats free for now", icon: Building2 },
        ],
      },
    ],
    featured: {
      eyebrow: "Self-hosted",
      title: "Team Server",
      body: "SSO with OpenID Connect, SCIM provisioning and signed policies, running inside your own network.",
      href: "/features/team-workspace",
      cta: "How teams use MotionQL",
      icon: Building2,
    },
  },
  {
    label: "Compare",
    href: "/compare",
    footer: "Full comparison",
    columns: [
      {
        title: "Multi-database IDEs",
        links: [compare("dbeaver"), compare("datagrip"), compare("tableplus"), compare("navicat", "Navicat")],
      },
      {
        title: "MongoDB tools",
        links: [
          compare("studio-3t", "Studio 3T"),
          compare("compass", "Compass"),
          compare("visualeaf"),
          compare("nosqlbooster"),
          compare("robo-3t"),
        ],
      },
    ],
    featured: {
      eyebrow: "Measured, not claimed",
      title: "Faster than Compass on every step we timed",
      body: "Same queries, same data, same server, timed from the click to the result on screen.",
      href: "/compare/compass",
      cta: "See the numbers",
      icon: Gauge,
    },
  },
  {
    label: "Resources",
    href: "/docs",
    footer: "Documentation",
    columns: [
      {
        title: "Learn",
        links: [
          { href: "/docs", label: "Documentation", blurb: "Install, connect, query and automate", icon: BookOpen },
          { href: "/videos", label: "Video tours", blurb: "The real app, captioned", icon: PlayCircle },
          { href: "/blog", label: "Blog", blurb: "Releases, guides and benchmarks", icon: Newspaper },
          { href: "/tools", label: "Free tools", blurb: "MongoDB utilities in your browser", icon: Wrench },
        ],
      },
      {
        title: "Help and updates",
        links: [
          { href: "/faq", label: "FAQ", blurb: "Pricing, platforms, privacy and teams", icon: CircleHelp },
          { href: "/support", label: "Support", blurb: "Email the team", icon: LifeBuoy },
          { href: "/changelog", label: "Changelog", blurb: "What's new in each release", icon: FileClock },
          { href: "/roadmap", label: "Roadmap", blurb: "What we're building next", icon: Map },
          { href: "/feedback", label: "Send feedback", blurb: "A bug, an idea or praise", icon: MessageSquarePlus },
        ],
      },
    ],
  },
];

/** Plain links shown after the menus. */
export const menuLinks: MenuLink[] = [{ href: "/pricing", label: "Pricing" }];
