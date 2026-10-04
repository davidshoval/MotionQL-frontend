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
};

export const nav = [
  { href: "/features", label: "Features" },
  { href: "/compare", label: "Compare" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tools", label: "Tools" },
  { href: "/changelog", label: "Changelog" },
];
