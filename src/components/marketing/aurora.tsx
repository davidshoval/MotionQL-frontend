import { cn } from "@/lib/utils";

/** Soft brand-coloured light behind a section. Pure CSS, so it costs nothing at runtime. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="animate-float absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--brand-mint)_calc(var(--glow-strength)*60%),transparent),transparent)] blur-2xl" />
      <div className="absolute top-24 -left-40 h-[28rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--brand-sky)_calc(var(--glow-strength)*45%),transparent),transparent)] blur-2xl" />
      <div className="absolute top-10 -right-48 h-[30rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--brand-violet)_calc(var(--glow-strength)*40%),transparent),transparent)] blur-2xl" />
    </div>
  );
}
