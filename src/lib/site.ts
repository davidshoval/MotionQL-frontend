export const site = {
  name: "MotionQL",
  domain: "motionql.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://motionql.com",
  tagline: "One desktop IDE for every database you run",
  description:
    "MotionQL is a fast, secure desktop IDE for 60+ databases: PostgreSQL, MySQL, SQL Server, Oracle, SQLite, MongoDB, Redis, Elasticsearch, ClickHouse, Snowflake, BigQuery, DynamoDB, Cassandra, Neo4j and more. Visual queries, explain plans, logs and analytics, migration and a private AI assistant. Free Pro license for a year.",
  releasesUrl: "https://github.com/davidshoval/motionql-releases/releases/latest",
  supportEmail: "support@motionql.com",
  securityEmail: "security@motionql.com",
  /** General contact address shown on /support. */
  contactEmail: "support@motionql.com",
  /** Response goal for support email, in business days. */
  supportResponseDays: 2,
  /** Community chat (Discord or similar). Hidden everywhere while empty. */
  communityUrl: process.env.NEXT_PUBLIC_COMMUNITY_URL ?? "",
};

export const nav = [
  { href: "/databases", label: "Databases" },
  { href: "/features", label: "Features" },
  { href: "/videos", label: "Videos" },
  { href: "/docs", label: "Docs" },
  { href: "/compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
];

/**
 * Platform wording. Static pages (metadata, structured data) use `withoutLinux` until Linux installers ship;
 * client components pick the right one from the latest release (see PlatformsText).
 */
export const platformsText = {
  short: { withLinux: "macOS, Windows and Linux", withoutLinux: "macOS and Windows, Linux coming soon" },
  long: {
    withLinux: "macOS (Apple Silicon and Intel), Windows and Linux (AppImage and .deb)",
    withoutLinux: "macOS (Apple Silicon and Intel) and Windows, with Linux coming soon",
  },
} as const;
