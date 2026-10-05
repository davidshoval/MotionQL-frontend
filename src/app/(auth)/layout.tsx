import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Aurora } from "@/components/marketing/aurora";
import { USE_MOCK } from "@/lib/api";
import { PlatformsText } from "@/components/app/platforms-text";

const perks = [
  "A personal Pro license, free for 12 months",
  <>
    Installers for <PlatformsText />
  </>,
  "Activate offline: no phone-home, ever",
  "Free team seats while we launch",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" aria-label="MotionQL home" className="w-fit">
          <Logo />
        </Link>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">{children}</main>
        {USE_MOCK && (
          <p className="text-muted-foreground mx-auto max-w-sm text-center text-xs">
            Preview mode: accounts live in this browser only and keys are samples that won&apos;t activate the app.
          </p>
        )}
      </div>
      <aside className="border-border bg-card/30 relative isolate hidden overflow-hidden border-l lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(70%_70%_at_50%_40%,#000,transparent)]" aria-hidden />
        <Aurora className="-z-10" />
        <div className="max-w-md">
          <h2 className="text-gradient text-4xl font-semibold tracking-[-0.035em]">Everything Pro. Free for a year.</h2>
          <ul className="mt-8 space-y-4">
            {perks.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-[15px]">
                <span className="bg-primary/15 text-primary grid size-6 place-items-center rounded-full">
                  <Check className="size-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="border-border bg-background/70 mt-12 rounded-2xl border p-5 font-mono text-[12px] shadow-2xl backdrop-blur">
            <p className="text-muted-foreground">Settings → License</p>
            <p className="border-border bg-foreground/[0.04] text-primary mt-3 truncate rounded-lg border px-3 py-2">
              MQL1.eyJsaWNlbnNlSWQiOiJsaWNfMDFKOVoi…
            </p>
            <p className="text-success mt-3 flex items-center gap-2">
              <Check className="size-3.5" /> Pro · valid until next year
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
