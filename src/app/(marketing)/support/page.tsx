import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Bug, LifeBuoy, Mail, MessagesSquare, Send, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with MotionQL. Email ${site.contactEmail}; we aim to reply within ${site.supportResponseDays} business days.`,
  alternates: { canonical: "/support" },
};

const selfHelp = [
  { href: "/docs", icon: BookOpen, title: "Documentation", body: "Install, connect, query, move data and automate." },
  {
    href: "/docs/troubleshooting",
    icon: LifeBuoy,
    title: "Troubleshooting",
    body: "Fixes for install, connection, license and keychain problems.",
  },
  { href: "/faq", icon: MessagesSquare, title: "FAQ", body: "Pricing, the free year, platforms, privacy and teams." },
  { href: "/feedback", icon: Send, title: "Send feedback", body: "A bug, an idea or praise: tell the team in a minute." },
];

export default function SupportPage() {
  const days = site.supportResponseDays;
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="We're here to help"
        description={`Email us and a person will reply. We aim to answer within ${days} business days.`}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href={`mailto:${site.contactEmail}`}>
              <Mail /> {site.contactEmail}
            </a>
          </Button>
          {site.communityUrl && (
            <Button asChild size="lg" variant="secondary">
              <a href={site.communityUrl} target="_blank" rel="noreferrer">
                <MessagesSquare /> Join the community
              </a>
            </Button>
          )}
        </div>
      </PageHero>

      <section className="container-page max-w-4xl space-y-14 pb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {selfHelp.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="border-border bg-card/50 hover:border-primary/40 group rounded-2xl border p-6 transition-colors"
            >
              <s.icon className="text-primary size-5" aria-hidden />
              <h2 className="group-hover:text-primary mt-4 flex items-center gap-1.5 font-semibold transition-colors">
                {s.title} <ArrowRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">{s.body}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <Bug className="text-primary size-5" aria-hidden /> Reporting a problem
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">So we can help on the first reply, include:</p>
            <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              <li>your MotionQL version (Settings → About) and operating system;</li>
              <li>what you did, what you expected and what happened, with the exact error message;</li>
              <li>the type of server: MongoDB version, Atlas, replica set or sharded, DocumentDB or Cosmos DB;</li>
              <li>
                if useful, a diagnostics file from <span className="text-foreground">Settings → Diagnostics → Export diagnostics…</span>.
                It&apos;s redacted, but review it before sending.
              </li>
            </ul>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Never send passwords, connection strings with credentials, license keys or customer data.
            </p>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <Mail className="text-primary size-5" aria-hidden /> What to expect
            </h2>
            <ul className="text-muted-foreground mt-3 space-y-3 text-sm leading-relaxed">
              <li>
                <span className="text-foreground font-medium">Response goal:</span> within {days} business days, usually sooner. This is a
                goal, not a guaranteed service level.
              </li>
              <li>
                <span className="text-foreground font-medium">Account and license help:</span> lost keys, renewals and team seats are
                handled on your{" "}
                <Link href="/account" className="text-primary hover:underline">
                  account page
                </Link>
                ; email us if something there doesn&apos;t work.
              </li>
              <li>
                <span className="text-foreground font-medium">Feature requests</span> are welcome: send them with the{" "}
                <Link href="/feedback?kind=idea" className="text-primary hover:underline">
                  feedback form
                </Link>
                . See what&apos;s already planned on the{" "}
                <Link href="/roadmap" className="text-primary hover:underline">
                  roadmap
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border bg-card/50 flex flex-col gap-3 rounded-2xl border p-6 sm:flex-row sm:items-center">
          <ShieldAlert className="text-warning size-5 shrink-0" aria-hidden />
          <p className="text-muted-foreground flex-1 text-sm">
            Found a security vulnerability? Please don&apos;t email the general address. Follow the{" "}
            <Link href="/legal/security-policy" className="text-primary hover:underline">
              security policy
            </Link>{" "}
            and write to{" "}
            <a href={`mailto:${site.securityEmail}`} className="text-primary hover:underline">
              {site.securityEmail}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
