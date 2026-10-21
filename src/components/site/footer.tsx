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
      { href: "/databases", label: "Supported databases" },
      { href: "/download/mac", label: "Database GUI for Mac" },
      { href: "/download/windows", label: "Database GUI for Windows" },
      { href: "/download/linux", label: "Database GUI for Linux" },
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
      { href: "/compare/dbeaver", label: "MotionQL vs DBeaver" },
      { href: "/compare/datagrip", label: "MotionQL vs DataGrip" },
      { href: "/compare/tableplus", label: "MotionQL vs TablePlus" },
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
            One desktop IDE for PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, Redis, ClickHouse and 50+ more. Built for developers, DBAs
            and data teams.
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
        <p>
          All product names and trademarks are the property of their owners. MotionQL is not affiliated with or endorsed by any database
          vendor.
        </p>
      </div>
    </footer>
  );
}
