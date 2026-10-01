"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** A card with a soft light that follows the pointer. */
export function SpotlightCard({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group border-border bg-card/60 hover:border-foreground/15 relative overflow-hidden rounded-3xl border backdrop-blur-sm transition-colors duration-300",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),color-mix(in_oklch,var(--brand-mint)_12%,transparent),transparent_70%)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
