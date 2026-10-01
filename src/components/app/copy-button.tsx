"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({
  value,
  label = "Copy",
  toastText = "Copied",
  ...props
}: { value: string; label?: string; toastText?: string } & React.ComponentProps<typeof Button>) {
  const [done, setDone] = useState(false);
  return (
    <Button
      {...props}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          toast.success(toastText);
          setTimeout(() => setDone(false), 1800);
        } catch {
          toast.error("Couldn't copy. Select the text and copy it manually.");
        }
      }}
    >
      {done ? <Check /> : <Copy />}
      {label}
    </Button>
  );
}
