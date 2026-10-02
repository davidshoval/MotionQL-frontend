"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check, Laptop, MonitorDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aurora } from "./aurora";
import { ProductWindow } from "./product-window";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.5, 1]);

  return (
    <section className="relative isolate overflow-hidden pt-36 pb-24 sm:pt-44">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <Aurora className="-z-10" />

      <div className="container-page flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <Link
            href="/register"
            className="group border-border bg-foreground/[0.04] text-muted-foreground hover:border-primary/40 hover:text-foreground inline-flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-[13px] backdrop-blur transition"
          >
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[11px] font-semibold">New</span>
            MotionQL 1.0 is here. Pro is free for your first year
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
          className="mt-8 max-w-5xl text-[2.9rem] leading-[0.98] font-semibold tracking-[-0.045em] text-balance sm:text-7xl lg:text-[5.5rem]"
        >
          <span className="text-gradient">The MongoDB IDE</span>
          <br />
          <span className="text-gradient-brand">you won&apos;t outgrow.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="text-muted-foreground mt-7 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl"
        >
          Everything you reach for in Compass and Studio 3T, in one fast desktop app: visual queries, aggregation, SQL, compare and sync,
          migration, and an AI assistant that never sees your data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="group h-13 px-8 text-base">
            <Link href="/register">
              <MonitorDown />
              Download free
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="h-13 px-7 text-base">
            <Link href="/compare">Compare with Studio 3T</Link>
          </Button>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]"
        >
          <li className="flex items-center gap-1.5">
            <Laptop className="size-3.5" /> macOS, Windows and Linux
          </li>
          {["No credit card", "Works offline", "Your data stays on your machine"].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <Check className="text-primary size-3.5" /> {t}
            </li>
          ))}
        </motion.ul>
      </div>

      <div ref={ref} className="container-page mt-20 [perspective:2000px]">
        <motion.div style={{ rotateX, scale, opacity }} className="relative mx-auto max-w-6xl origin-top">
          <div className="absolute -inset-x-10 -inset-y-8 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_30%,color-mix(in_oklch,var(--brand-mint)_28%,transparent),transparent)] blur-3xl" />
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-2 backdrop-blur">
            <ProductWindow />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
