import Link from "next/link";
import { Logo } from "./logo";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/videos", label: "Video tours" },
      { href: "/download", label: "Download" },
      { href: "/download/mac", label: "MongoDB GUI for Mac" },
      { href: "/download/windows", label: "MongoDB GUI for Windows" },
      { href: "/download/linux", label: "MongoDB GUI for Linux" },
      { href: "/pricing", label: "Pricing" },
      { href: "/changelog", label: "Changelog" },
      { href: "/tools", label: "Free MongoDB tools" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/support", label: "Support" },
      { href: "/feedback", label: "Send feedback" },
    ],
  },
  {
    title: "Switch to MotionQL",
    links: [
      { href: "/compare/studio-3t", label: "MotionQL vs Studio 3T" },
      { href: "/compare/compass", label: "MotionQL vs Compass" },
      { href: "/compare/robo-3t", label: "MotionQL vs Robo 3T" },
      { href: "/compare/visualeaf", label: "MotionQL vs VisuaLeaf" },
      { href: "/compare", label: "All comparisons" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/security", label: "Security" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/security-policy", label: "Report a vulnerability" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/eula", label: "EULA" },
      { href: "/legal/acceptable-use", label: "Acceptable Use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border relative mt-24 border-t">
      <div className="container-page grid gap-12 py-16 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            The desktop IDE for MongoDB, Atlas, DocumentDB, Cosmos DB and FerretDB. Built for developers, DBAs and data teams.
          </p>
          <a href={`mailto:${site.supportEmail}`} className="text-muted-foreground hover:text-foreground mt-4 inline-block text-sm">
            {site.supportEmail}
          </a>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-medium">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page border-border text-muted-foreground flex flex-col gap-2 border-t py-6 text-xs sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} MotionQL. All rights reserved.</p>
        <p>MongoDB is a trademark of MongoDB, Inc. MotionQL is not affiliated with MongoDB, Inc. or 3T Software Labs.</p>
      </div>
    </footer>
  );
}
