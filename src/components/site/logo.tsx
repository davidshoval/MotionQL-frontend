import { cn } from "@/lib/utils";

/** The MotionQL mark: the X whose back stroke is a query lens (same drawing as the app icon). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="100 100 824 824" className={cn("size-7", className)} aria-hidden>
      <defs>
        <linearGradient id="xq-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0FA37F" />
          <stop offset="0.55" stopColor="#0B6E6A" />
          <stop offset="1" stopColor="#10254A" />
        </linearGradient>
        <linearGradient id="xq-lens" gradientUnits="userSpaceOnUse" x1="300" y1="300" x2="740" y2="740">
          <stop offset="0" stopColor="#B9F6D8" />
          <stop offset="1" stopColor="#5EE0A8" />
        </linearGradient>
      </defs>
      <rect x="100" y="100" width="824" height="824" rx="186" fill="url(#xq-bg)" />
      <g strokeLinecap="round" fill="none">
        <line x1="706" y1="318" x2="318" y2="706" stroke="#fff" strokeWidth="116" />
        <circle cx="432" cy="432" r="118" stroke="url(#xq-lens)" strokeWidth="72" />
        <line x1="532" y1="532" x2="706" y2="706" stroke="url(#xq-lens)" strokeWidth="116" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <LogoMark />
      <span className="text-[17px]">MotionQL</span>
    </span>
  );
}
