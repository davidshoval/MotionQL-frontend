import Link from "next/link";
import { Download, KeyRound, UserPlus } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { PlatformsText } from "@/components/app/platforms-text";

const steps = [
  { icon: UserPlus, t: "Create your free account", d: "Email and password. Verify your address and your Pro key is ready." },
  {
    icon: Download,
    t: "Download for your OS",
    d: (
      <>
        <PlatformsText variant="long" />. Installers aren&apos;t code-signed yet;{" "}
        <Link href="/docs/install#about-the-security-warnings" className="text-primary hover:underline">
          see how to open them
        </Link>
        .
      </>
    ),
  },
  { icon: KeyRound, t: "Paste your key", d: "Settings → License → Activate. Verified offline, so it works behind any firewall." },
];

export function Steps() {
  return (
    <section className="container-page py-28">
      <SectionHeading eyebrow="Get started" title="Up and running in two minutes" />
      <ol className="relative mt-16 grid gap-4 md:grid-cols-3">
        <div
          aria-hidden
          className="via-primary/50 absolute top-10 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent to-transparent md:block"
        />
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.1}>
            <li className="relative flex flex-col items-center text-center">
              <span className="border-border bg-card relative grid size-20 place-items-center rounded-3xl border shadow-[0_0_0_8px_var(--background)]">
                <s.icon className="text-primary size-7" />
                <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 grid size-7 place-items-center rounded-full font-mono text-xs font-semibold">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.t}</h3>
              <p className="text-muted-foreground mt-2 max-w-xs text-[15px] leading-relaxed">{s.d}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
