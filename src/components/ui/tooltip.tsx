"use client";

import * as React from "react";
import { Tooltip as T } from "radix-ui";
import { cn } from "@/lib/utils";

function Tooltip({ children, content, ...props }: React.ComponentProps<typeof T.Root> & { content: React.ReactNode }) {
  return (
    <T.Provider delayDuration={150}>
      <T.Root {...props}>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content
            sideOffset={6}
            className={cn("border-border bg-popover text-popover-foreground z-50 max-w-64 rounded-lg border px-3 py-1.5 text-xs shadow-lg")}
          >
            {content}
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
}

export { Tooltip };
