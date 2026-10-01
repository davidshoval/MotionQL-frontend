import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Everything most developers need, free forever. No license key required.",
    cta: { label: "Download", href: "/register" },
    features: [
      "Connections with every auth method",
      "Visual query builder and IntelliShell",
      "Aggregation editor with stage preview",
      "SQL Query and Query Code",
      "Import, export, Compare & Sync",
      "Schema analysis and dashboards",
      "AI assistant with your own key",
    ],
  },
  {
    name: "Pro",
    price: "$0",
    period: "for 12 months",
    badge: "Launch offer",
    blurb: "Every Pro feature, free for your first year when you create an account.",
    cta: { label: "Get your free Pro key", href: "/register" },
    highlight: true,
    features: [
      "Everything in Free",
      "SQL Migration from Postgres, MySQL, SQL Server, Oracle",
      "Data Masking with 11 methods",
      "Scheduled tasks and background runner",
      "MongoDB Atlas management",
      "Renew free with one click while the offer lasts",
    ],
  },
  {
    name: "Teams",
    price: "$0",
    period: "per seat, for now",
    blurb: "A Pro key for every teammate, managed from one place.",
    cta: { label: "Create a team", href: "/register?next=/team/new" },
    features: [
      "Everything in Pro, for each member",
      "Invite by email, assign and free seats",
      "Reissue or revoke a key in one click",
      "Roles for owners, admins and members",
      "Audit log of every change",
      "Enterprise: self-hosted Team Server with SSO",
    ],
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((p, i) => (
        <Reveal key={p.name} delay={i * 0.08} className="h-full">
          <div
            className={cn(
              "relative flex h-full flex-col rounded-3xl p-8",
              p.highlight
                ? "border-beam shadow-[0_30px_80px_-30px_color-mix(in_oklch,var(--brand-mint)_45%,transparent)]"
                : "border-border bg-card/50 border",
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              {p.badge && (
                <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">{p.badge}</span>
              )}
            </div>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight">{p.price}</span>
              <span className="text-muted-foreground">{p.period}</span>
            </p>
            <p className="text-muted-foreground mt-4 text-[15px]">{p.blurb}</p>
            <Button asChild className="mt-8" variant={p.highlight ? "default" : "secondary"}>
              <Link href={p.cta.href}>{p.cta.label}</Link>
            </Button>
            <ul className="border-border mt-8 space-y-3 border-t pt-8">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-[14.5px]">
                  <Check className="text-primary mt-0.5 size-4 shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
