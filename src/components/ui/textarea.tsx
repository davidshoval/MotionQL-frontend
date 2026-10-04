import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-foreground/[0.03] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/25 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex min-h-24 w-full min-w-0 rounded-lg border px-3.5 py-3 text-[15px] transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
