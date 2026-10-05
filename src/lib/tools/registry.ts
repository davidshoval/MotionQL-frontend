import type { Metadata } from "next";
import { site } from "@/lib/site";

export type ToolSlug =
  | "connection-string-builder"
  | "objectid-converter"
  | "extended-json-converter"
  | "bson-size-calculator"
  | "explain-plan-analyzer"
  | "operators-cheat-sheet";

export type ToolInfo = {
  slug: ToolSlug;
  /** Short name for cards and links. */
  name: string;
  /** Page <title> (the site template appends "· MotionQL"). */
  title: string;
  /** H1 on the page. */
  heading: string;
  description: string;
  keywords: string[];
};

export const TOOLS: ToolInfo[] = [
  {
    slug: "connection-string-builder",
    name: "Connection string builder",
    title: "MongoDB Connection String Builder & Parser",
    heading: "MongoDB connection string builder",
    description:
      "Build or parse mongodb:// and mongodb+srv:// URIs. Split a pasted URI into hosts, credentials and options, catch common mistakes, and copy a correctly encoded string with the password masked.",
    keywords: ["mongodb connection string", "mongodb uri builder", "mongodb+srv", "connection string parser", "authSource", "replicaSet"],
  },
  {
    slug: "objectid-converter",
    name: "ObjectId converter",
    title: "MongoDB ObjectId to Timestamp Converter & Generator",
    heading: "ObjectId decoder and generator",
    description:
      "Decode a MongoDB ObjectId into its creation time, random value and counter, decode many at once, or generate ObjectIds for any date to query by time range.",
    keywords: ["objectid to date", "objectid timestamp", "mongodb objectid generator", "objectid decoder", "objectid from date"],
  },
  {
    slug: "extended-json-converter",
    name: "Extended JSON converter",
    title: "MongoDB Extended JSON Converter (Canonical, Relaxed, Shell)",
    heading: "Extended JSON converter",
    description:
      "Convert MongoDB documents between canonical Extended JSON, relaxed Extended JSON and mongosh shell syntax, keeping BSON types like ObjectId, Date, Long and Decimal128 intact.",
    keywords: ["mongodb extended json", "ejson converter", "canonical ejson", "relaxed ejson", "mongosh to json", "ISODate to json"],
  },
  {
    slug: "bson-size-calculator",
    name: "BSON size calculator",
    title: "BSON Document Size Calculator (16 MB Limit Check)",
    heading: "BSON document size calculator",
    description:
      "Paste a document to get its exact BSON size in bytes, see how close it is to MongoDB's 16 MB document limit, and find the fields taking up the most space.",
    keywords: ["bson size", "mongodb document size", "16mb limit", "bsonsize", "mongodb document too large", "object size calculator"],
  },
  {
    slug: "explain-plan-analyzer",
    name: "Explain plan analyzer",
    title: "MongoDB Explain Plan Analyzer & Index Advisor",
    heading: "Explain plan analyzer",
    description:
      "Paste the output of explain() to see the plan as a tree, catch collection scans and in-memory sorts, compare documents examined with documents returned, and get an index suggestion.",
    keywords: [
      "mongodb explain",
      "explain executionStats",
      "COLLSCAN",
      "mongodb query performance",
      "index suggestion",
      "explain plan visualizer",
    ],
  },
  {
    slug: "operators-cheat-sheet",
    name: "Operators cheat sheet",
    title: "MongoDB Query & Aggregation Operators Cheat Sheet",
    heading: "MongoDB operators cheat sheet",
    description:
      "Searchable reference of MongoDB query, update and aggregation operators and pipeline stages, each with example syntax and a link to the official documentation.",
    keywords: [
      "mongodb cheat sheet",
      "aggregation operators",
      "mongodb query operators",
      "mongodb update operators",
      "aggregation pipeline stages",
    ],
  },
];

export function getTool(slug: ToolSlug): ToolInfo {
  return TOOLS.find((t) => t.slug === slug)!;
}

// Same image as the root layout; repeated because a page's openGraph object replaces the parent's.
const ogImage = { url: "/og-image.png", width: 1200, height: 630, alt: "MotionQL: the modern MongoDB GUI, free" };

export function pageMetadata(opts: { title: string; description: string; path: string; keywords?: string[] }): Metadata {
  const url = `${site.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: opts.path },
    openGraph: { type: "website", siteName: site.name, title: opts.title, description: opts.description, url, images: [ogImage] },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [ogImage] },
  };
}

export function toolMetadata(slug: ToolSlug): Metadata {
  const t = getTool(slug);
  return pageMetadata({ title: t.title, description: t.description, path: `/tools/${t.slug}`, keywords: t.keywords });
}
