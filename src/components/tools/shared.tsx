"use client";

import { useState } from "react";
import { Check, CircleAlert, CircleCheck, Copy, Info, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const selectClass =
  "border-input bg-foreground/[0.03] focus-visible:border-ring focus-visible:ring-ring/25 h-11 w-full rounded-lg border px-3 text-[15px] outline-none focus-visible:ring-3 [&>option]:bg-popover";

export const monoArea = "font-mono text-[13px] leading-relaxed";

export function Panel({
  title,
  actions,
  children,
  className,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-border bg-card/60 min-w-0 rounded-2xl border p-4 sm:p-5", className)}>
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-sm font-medium">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-1.5">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/** Small copy-to-clipboard button that confirms inline (no toast, so nothing leaves the panel). */
export function CopyText({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={className}
      disabled={!value}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard blocked: the text is selectable */
        }
      }}
    >
      {done ? <Check /> : <Copy />}
      {done ? "Copied" : label}
    </Button>
  );
}

export function CodeBlock({ value, className, wrap = false }: { value: string; className?: string; wrap?: boolean }) {
  return (
    <pre
      className={cn(
        "border-border bg-foreground/[0.03] max-h-[32rem] overflow-auto rounded-lg border p-3.5",
        monoArea,
        wrap ? "break-all whitespace-pre-wrap" : "whitespace-pre",
        className,
      )}
    >
      <code>{value}</code>
    </pre>
  );
}

export type Level = "error" | "warning" | "info" | "good";

const levelStyle: Record<Level, { icon: React.ComponentType<{ className?: string }>; cls: string; label: string }> = {
  error: { icon: CircleAlert, cls: "text-destructive border-destructive/30 bg-destructive/[0.06]", label: "Error" },
  warning: { icon: TriangleAlert, cls: "text-warning border-warning/30 bg-warning/[0.06]", label: "Warning" },
  info: { icon: Info, cls: "text-brand-sky border-brand-sky/30 bg-brand-sky/[0.06]", label: "Note" },
  good: { icon: CircleCheck, cls: "text-success border-success/30 bg-success/[0.06]", label: "Good" },
};

export function Notice({ level, title, children }: { level: Level; title: React.ReactNode; children?: React.ReactNode }) {
  const s = levelStyle[level];
  return (
    <div className={cn("flex gap-3 rounded-xl border p-3", s.cls)} role={level === "error" ? "alert" : undefined}>
      <s.icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 text-sm">
        <p className="text-foreground font-medium">
          <span className="sr-only">{s.label}: </span>
          {title}
        </p>
        {children && <div className="text-muted-foreground mt-1 leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-destructive mt-2 flex items-start gap-2 text-sm" role="alert">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: Level }) {
  return (
    <div className="border-border bg-foreground/[0.02] rounded-xl border p-3.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-xl font-semibold tabular-nums",
          tone === "error" && "text-destructive",
          tone === "warning" && "text-warning",
          tone === "good" && "text-success",
        )}
      >
        {value}
      </p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}
