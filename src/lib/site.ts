export const site = {
  name: "MotionQL",
  domain: "motionql.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://motionql.com",
  tagline: "The MongoDB IDE for people who outgrew Compass",
  description:
    "MotionQL is a fast, secure desktop IDE for MongoDB, Atlas and every Mongo-compatible database. Visual queries, aggregation, SQL, compare and sync, migration, and a private AI assistant. Free Pro license for a year.",
  releasesUrl: "https://github.com/davidshoval/motionql-releases/releases/latest",
  supportEmail: "support@motionql.com",
  securityEmail: "security@motionql.com",
  /** General contact address shown on /support. */
  contactEmail: "hello@motionql.com",
  /** Response goal for support email, in business days. */
  supportResponseDays: 2,
  /** Community chat (Discord or similar). Hidden everywhere while empty. */
  communityUrl: process.env.NEXT_PUBLIC_COMMUNITY_URL ?? "",
};

export const nav = [
  { href: "/features", label: "Features" },
  { href: "/docs", label: "Docs" },
  { href: "/compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tools", label: "Tools" },
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
