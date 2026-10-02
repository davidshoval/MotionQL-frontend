"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import { api, ApiError, type License } from "@/lib/api";
import { qk } from "@/lib/api/hooks";
import { cn, daysUntil, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./copy-button";
import { ConfirmDialog } from "./confirm-dialog";

const editionName = { pro: "Pro", enterprise: "Enterprise", trial: "Trial" } as const;

function maskKey(key: string) {
  return key.length > 24 ? `${key.slice(0, 14)}${"•".repeat(18)}${key.slice(-8)}` : key;
}

export function LicenseCard({ license }: { license: License }) {
  const qc = useQueryClient();
  const [show, setShow] = useState(false);
  const [confirmReissue, setConfirmReissue] = useState(false);
  const days = daysUntil(license.expiresAt);
  const total = Math.max(1, (new Date(license.expiresAt).getTime() - new Date(license.issuedAt).getTime()) / 86_400_000);
  const pct = Math.min(100, Math.max(0, (days / total) * 100));
  const active = license.status === "active";
  const expiringSoon = active && days <= 30;
  const personal = license.source === "free";

  const renew = useMutation({
    mutationFn: () => api.renewLicense(),
    onSuccess: () => {
      toast.success("Renewed for another year. Paste the new key into MotionQL.");
      qc.invalidateQueries({ queryKey: qk.licenses });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Couldn't renew. Try again."),
  });

  return (
    <div className={cn("relative overflow-hidden rounded-3xl p-1", active ? "border-beam" : "border-border bg-card/50 border")}>
      <div className="bg-card relative overflow-hidden rounded-[1.3rem] p-7">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--brand-mint)_22%,transparent),transparent)]"
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary grid size-11 place-items-center rounded-2xl">
              <KeyRound className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">MotionQL {editionName[license.edition]}</h2>
                {license.status === "active" && <Badge variant="success">Active</Badge>}
                {license.status === "expired" && <Badge variant="warning">Expired</Badge>}
                {license.status === "revoked" && <Badge variant="destructive">Revoked</Badge>}
                {license.status === "replaced" && <Badge variant="secondary">Replaced</Badge>}
              </div>
              <p className="text-muted-foreground text-sm">
                {license.team ? `Managed by ${license.team.name}` : personal ? "Personal license" : "Issued by MotionQL"} · {license.seats} seat
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">
              {active ? "Valid until" : license.status === "revoked" ? "Revoked on" : license.status === "replaced" ? "Was valid until" : "Expired on"}
            </p>
            <p className="font-medium">{formatDate(license.status === "revoked" ? license.revokedAt : license.expiresAt)}</p>
          </div>
        </div>

        {active && (
          <div className="relative mt-6">
            <div className="bg-foreground/[0.07] h-1.5 overflow-hidden rounded-full">
              <div className={cn("h-full rounded-full", expiringSoon ? "bg-warning" : "bg-primary")} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">{days} days left</p>
          </div>
        )}

        <div className="border-border bg-background/60 relative mt-6 rounded-2xl border p-4">
          <p className="text-muted-foreground text-xs">License key</p>
          <p className="text-foreground mt-1.5 font-mono text-[13px] break-all select-all">{show ? license.key : maskKey(license.key)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton
              value={license.key}
              label="Copy key"
              toastText="Key copied. Paste it in MotionQL → Settings → License."
              size="sm"
              disabled={!active}
            />
            <Button variant="secondary" size="sm" onClick={() => setShow((s) => !s)}>
              {show ? <EyeOff /> : <Eye />}
              {show ? "Hide" : "Show"}
            </Button>
            {personal && active && (
              <Button variant="ghost" size="sm" onClick={() => setConfirmReissue(true)}>
                <RotateCcw /> Reissue
              </Button>
            )}
          </div>
        </div>

        {personal && (expiringSoon || license.status === "expired") && (
          <div className="border-primary/30 bg-primary/[0.06] relative mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
            <p className="flex items-center gap-2 text-sm">
              <Sparkles className="text-primary size-4" /> Renew free for another 12 months.
            </p>
            <Button size="sm" onClick={() => renew.mutate()} disabled={renew.isPending}>
              {renew.isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              Renew free
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmReissue}
        onOpenChange={setConfirmReissue}
        title="Reissue your license key?"
        description="You'll get a new key with the same end date, and the current one stops working in MotionQL within a few hours. Use this if your key was shared or leaked."
        confirmLabel="Reissue key"
        onConfirm={async () => {
          try {
            await api.reissueLicense(license.licenseId);
            toast.success("New key issued. Paste it into MotionQL.");
            await qc.invalidateQueries({ queryKey: qk.licenses });
          } catch (e) {
            toast.error(e instanceof ApiError ? e.message : "Couldn't reissue. Try again.");
          }
        }}
      />
    </div>
  );
}
