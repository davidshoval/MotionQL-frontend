import Link from "next/link";
import { ArrowRight, Eye, FileLock2, KeyRound, ScrollText, ServerCog, ShieldCheck, Users, WifiOff } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";

const points = [
  {
    icon: ShieldCheck,
    t: "Read-only connections",
    d: "Mark a connection read-only and every write is blocked inside the app, including $out, $merge and explain-wrapped writes.",
  },
  {
    icon: KeyRound,
    t: "Secrets in your OS keychain",
    d: "Passwords, keys and tokens are encrypted with macOS Keychain, Windows DPAPI or Linux Secret Service, and never reach the UI.",
  },
  {
    icon: Eye,
    t: "No data leaves your machine",
    d: "XQuery talks straight to your database. We never receive documents, queries, connection settings or credentials.",
  },
  {
    icon: ScrollText,
    t: "Local audit log",
    d: "Writes and security events are recorded with credentials redacted. Typed-name confirmation guards every drop.",
  },
  {
    icon: WifiOff,
    t: "Works air-gapped",
    d: "Licenses are verified offline with a digital signature. No phone-home, no hardware fingerprinting.",
  },
  {
    icon: FileLock2,
    t: "Policies for IT",
    d: "Push policy.json through MDM or GPO to enforce read-only hosts, AI rules, script mode and idle lock across a fleet.",
  },
  {
    icon: Users,
    t: "Self-hosted Team Server",
    d: "SSO with Okta, Entra ID or Google, SCIM, shared queries and snippets, and a hash-chained central audit log.",
  },
  {
    icon: ServerCog,
    t: "Hardened Electron",
    d: "Sandboxed renderer with strict CSP, verified IPC, Electron fuses and an integrity-checked app bundle.",
  },
];

export function SecuritySection() {
  return (
    <section className="container-page py-28">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          align="left"
          eyebrow="Secure by design"
          title="Safe enough for production. Simple enough for Friday afternoon."
          description="The guardrails DBAs ask for, built into the app instead of bolted on."
        />
        <Reveal>
          <Button asChild variant="secondary">
            <Link href="/security">
              How XQuery keeps you safe <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </div>
      <div className="border-border bg-border mt-14 grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p, i) => (
          <Reveal key={p.t} delay={(i % 4) * 0.05} className="bg-background hover:bg-card p-7 transition-colors">
            <p.icon className="text-primary size-5" />
            <h3 className="mt-5 font-semibold tracking-tight">{p.t}</h3>
            <p className="text-muted-foreground mt-2 text-[14.5px] leading-relaxed">{p.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
