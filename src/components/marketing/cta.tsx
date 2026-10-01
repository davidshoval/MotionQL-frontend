import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";
import { Reveal } from "./reveal";

export function Cta() {
  return (
    <section className="container-page py-16">
      <Reveal>
        <div className="border-border relative isolate overflow-hidden rounded-[2.5rem] border px-6 py-20 text-center sm:px-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_50%_0%,color-mix(in_oklch,var(--brand-mint)_30%,transparent),transparent_70%)]"
          />
          <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(60%_80%_at_50%_0%,#000,transparent)]" />
          <LogoMark className="mx-auto size-16 drop-shadow-[0_10px_30px_color-mix(in_oklch,var(--brand-mint)_50%,transparent)]" />
          <h2 className="text-gradient mx-auto mt-8 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
            Your next query deserves a better IDE.
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg">
            Create a free account, download XQuery, and paste your Pro key. You&apos;ll be querying in under two minutes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 px-8 text-base">
              <Link href="/register">
                Get XQuery free <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-13 px-6 text-base">
              <Link href="/features">Explore every feature</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
