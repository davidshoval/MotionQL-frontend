"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** A confirmation step for actions that revoke keys or delete things. Optionally asks the user to type a word. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive,
  typeToConfirm,
  input,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  typeToConfirm?: string;
  /** Ask for a value (such as the password) and pass it to onConfirm. */
  input?: { label: string; type?: string; autoComplete?: string };
  onConfirm: (value: string) => Promise<unknown>;
}) {
  const [busy, setBusy] = useState(false);
  const [typed, setTyped] = useState("");
  const blocked = typeToConfirm ? typed.trim() !== typeToConfirm : input ? !typed : false;
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!busy) {
          onOpenChange(o);
          setTyped("");
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {typeToConfirm && (
          <div className="grid gap-2">
            <label htmlFor="confirm-word" className="text-muted-foreground text-sm">
              Type <span className="text-foreground font-mono">{typeToConfirm}</span> to confirm
            </label>
            <Input id="confirm-word" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
          </div>
        )}
        {input && (
          <div className="grid gap-2">
            <label htmlFor="confirm-input" className="text-sm text-muted-foreground">
              {input.label}
            </label>
            <Input
              id="confirm-input"
              type={input.type ?? "text"}
              autoComplete={input.autoComplete ?? "off"}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={busy || blocked}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm(typed);
                onOpenChange(false);
                setTyped("");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy && <Loader2 className="animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
