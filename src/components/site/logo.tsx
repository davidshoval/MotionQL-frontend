import { cn } from "@/lib/utils";

/** The MotionQL mark: a slanted M with a mint data point (the small-size app icon, crisp at 16-48 px). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="40 40 944 944" className={cn("size-7", className)} aria-hidden>
      <defs>
        <linearGradient id="mq-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0FA37F" />
          <stop offset="0.55" stopColor="#0B6E6A" />
          <stop offset="1" stopColor="#10254A" />
        </linearGradient>
        <linearGradient id="mq-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="944" height="944" rx="210" fill="url(#mq-bg)" />
      <rect x="40" y="40" width="944" height="944" rx="210" fill="url(#mq-shine)" />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(512 512) skewX(-6) translate(-512 -512)">
        <path d="M320 724 V320 L520 600 L720 320 V520" stroke="#fff" strokeWidth="112" />
        <circle cx="720" cy="704" r="66" fill="#5EE0A8" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <LogoMark />
      <span className="text-[17px]">
        Motion<span className="text-primary">QL</span>
      </span>
    </span>
  );
}
