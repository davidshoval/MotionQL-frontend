import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Database, KeyRound, Laptop, Lock, Server, Sparkles } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { SecuritySection } from "@/components/marketing/security-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How MotionQL protects your databases and credentials: process isolation, OS keychain encryption, enforced read-only connections, offline licensing and a private AI assistant.",
};

const flow = [
  {
    icon: Laptop,
    t: "Interface",
    d: "Sandboxed and context-isolated, with a strict content security policy. It never touches MongoDB, files or secrets.",
  },
  {
    icon: Cpu,
    t: "App core",
    d: "Runs every database call, enforces read-only, AI and script policies, and holds secrets encrypted with your OS keychain.",
  },
  { icon: Database, t: "Your database", d: "MotionQL connects straight from your computer. Nothing is proxied through us." },
];

const promises = [
  {
    icon: Lock,
    t: "We never receive your data",
    d: "No documents, queries, connection settings or credentials ever reach MotionQL's servers.",
  },
  {
    icon: KeyRound,
    t: "Offline license checks",
    d: "Keys are signed and verified on your machine. No phone-home at launch, no hardware fingerprinting.",
  },
  {
    icon: Sparkles,
    t: "AI goes to your provider, not us",
    d: "Requests go straight from your computer to the provider you chose, with schema-level context only.",
  },
  {
    icon: Server,
    t: "Opt-in telemetry only",
    d: "Anonymous usage stats and crash reports are off unless you allow them, and IT can block them by policy.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Built for production databases"
        description="MotionQL is designed so that a mistake in the UI can't become a write to production, and so your credentials never leave your machine."
      />
      <section className="container-page py-12">
        <SectionHeading
          title="How a query travels"
          description="Three layers, each with one job. The part you click on is the part with the least power."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {flow.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.08} className="border-border bg-card/50 relative rounded-3xl border p-7">
              <span className="text-muted-foreground font-mono text-xs">0{i + 1}</span>
              <f.icon className="text-primary mt-4 size-6" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{f.t}</h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{f.d}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <SecuritySection />
      <section className="container-page py-12">
        <SectionHeading title="Our privacy promises" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {promises.map((p, i) => (
            <Reveal key={p.t} delay={(i % 2) * 0.06} className="border-border bg-card/50 flex gap-5 rounded-3xl border p-7">
              <p.icon className="text-primary size-6 shrink-0" />
              <div>
                <h3 className="font-semibold tracking-tight">{p.t}</h3>
                <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/legal/security-policy">
              Report a vulnerability <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/legal/privacy">Read the privacy policy</Link>
          </Button>
        </div>
      </section>
      <Cta />
    </>
  );
}
