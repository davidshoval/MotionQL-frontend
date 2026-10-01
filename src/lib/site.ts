export const site = {
  name: "XQuery",
  domain: "xquery.io",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xquery.io",
  tagline: "The MongoDB IDE for people who outgrew Compass",
  description:
    "XQuery is a fast, secure desktop IDE for MongoDB, Atlas and every Mongo-compatible database. Visual queries, aggregation, SQL, compare and sync, migration, and a private AI assistant. Free Pro license for a year.",
  releasesUrl: "https://github.com/davidshoval/Xquery.io-releases/releases/latest",
  demoVideoId: "kcwrXAxooik",
  supportEmail: "support@xquery.io",
  securityEmail: "security@xquery.io",
};

export const nav = [
  { href: "/features", label: "Features" },
  { href: "/compare", label: "Compare" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
];
