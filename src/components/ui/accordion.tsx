"use client";

import * as React from "react";
import { Accordion as A } from "radix-ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = A.Root;

function AccordionItem({ className, ...props }: React.ComponentProps<typeof A.Item>) {
  return <A.Item className={cn("border-border border-b last:border-b-0", className)} {...props} />;
}
function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof A.Trigger>) {
  return (
    <A.Header className="flex">
      <A.Trigger
        className={cn(
          "group hover:text-primary flex flex-1 cursor-pointer items-center justify-between gap-4 py-5 text-left text-[15px] font-medium transition-colors [&[data-state=open]>svg]:rotate-45",
          className,
        )}
        {...props}
      >
        {children}
        <Plus className="text-muted-foreground size-4 shrink-0 transition-transform duration-300" />
      </A.Trigger>
    </A.Header>
  );
}
function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof A.Content>) {
  return (
    <A.Content
      className="text-muted-foreground overflow-hidden text-[15px] data-[state=closed]:animate-[accordion-up_200ms_ease-out] data-[state=open]:animate-[accordion-down_200ms_ease-out]"
      {...props}
    >
      <div className={cn("pb-5 leading-relaxed", className)}>{children}</div>
    </A.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
