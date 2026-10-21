"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, KeyRound, Loader2, RefreshCw } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { qk } from "@/lib/api/hooks";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "@/components/app/copy-button";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { daysLeftText, downloadText, EXPIRING_DAYS, keysCsv, keyState, keyStateBadge, maskKey, type KeyState } from "./license-utils";

type Filter = "current" | "expiring" | "all";

/** Every key the team has issued: who holds it, its status and end date, and what happened to old ones. */
export function LicensesPanel({ teamId }: { teamId: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: qk.teamLicenses(teamId),
    queryFn: () => api.teamLicenses(teamId).then((r) => r.licenses),
  });
  const [filter, setFilter] = useState<Filter>("current");
  const [confirmRenew, setConfirmRenew] = useState(false);

  const rows = useMemo(() => (data ?? []).map((l) => ({ ...l, state: keyState(l) as KeyState })), [data]);
  const current = rows.filter((l) => l.current);
  const expiring = current.filter((l) => l.state === "expiring" || l.state === "expired");
  const shown = filter === "current" ? current : filter === "expiring" ? expiring : rows;

  const renew = useMutation({
    mutationFn: () => api.renewExpiring(teamId, { withinDays: EXPIRING_DAYS, sendEmail: true }),
    onSuccess: ({ renewed }) => {
      toast.success(
        renewed ? `Renewed ${renewed} key${renewed === 1 ? "" : "s"}. Each person was emailed their new key.` : "Nothing to renew.",
      );
      qc.invalidateQueries({ queryKey: ["team", teamId] });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Couldn't renew. Try again."),
  });

  function exportCsv() {
    const url = api.licensesCsvUrl(teamId);
    if (url) return window.location.assign(url);
    downloadText(
      "motionql-team-licenses.csv",
      keysCsv(current.map((l) => ({ email: l.assignee.email, name: l.assignee.name, expiresAt: l.expiresAt, key: l.key }))),
    );
  }

  if (isLoading) return <Skeleton className="h-60 rounded-2xl" />;
  return (
    <Card className="overflow-hidden">
      <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div className="bg-foreground/[0.04] flex gap-1 rounded-lg p-1 text-sm" role="tablist" aria-label="Which keys">
          {(
            [
              ["current", `In use (${current.length})`],
              ["expiring", `Expiring (${expiring.length})`],
              ["all", `All issued (${rows.length})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-md px-3 py-1.5 transition",
                filter === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => setConfirmRenew(true)} disabled={!expiring.length || renew.isPending}>
            {renew.isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Renew expiring
          </Button>
          <Button variant="secondary" size="sm" onClick={exportCsv} disabled={!current.length}>
            <Download /> Export keys
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-muted-foreground text-left text-xs">
            <tr className="border-border border-b">
              <th className="px-5 py-3 font-medium">Assigned to</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Issued</th>
              <th className="px-5 py-3 font-medium">Expires</th>
              <th className="px-5 py-3 font-medium">Key</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.licenseId} className={cn("border-border/60 border-b last:border-0", !l.current && "text-muted-foreground")}>
                <td className="px-5 py-3.5">
                  <p className={cn("truncate", l.current && "font-medium")}>{l.assignee.name || l.assignee.email}</p>
                  {l.assignee.name && <p className="text-muted-foreground truncate text-xs">{l.assignee.email}</p>}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={keyStateBadge[l.state].variant}>{keyStateBadge[l.state].label}</Badge>
                  {l.revokeReason && !l.current && <p className="text-muted-foreground mt-1 text-xs">{l.revokeReason}</p>}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {formatDate(l.issuedAt)}
                  {l.issuedBy && <span className="text-muted-foreground block text-xs">by {l.issuedBy}</span>}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {formatDate(l.expiresAt)}
                  {l.status === "active" && (
                    <span className={cn("block text-xs", l.state === "expiring" ? "text-warning" : "text-muted-foreground")}>
                      {daysLeftText(l.expiresAt)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {l.key ? (
                    <span className="flex items-center gap-2">
                      <code className="text-muted-foreground font-mono text-xs">{maskKey(l.key)}</code>
                      <CopyButton
                        value={l.key}
                        label=""
                        aria-label={`Copy key for ${l.assignee.email}`}
                        toastText={`Key for ${l.assignee.email} copied`}
                        variant="ghost"
                        size="icon"
                      />
                    </span>
                  ) : (
                    <span className="font-mono text-xs">{l.licenseId}</span>
                  )}
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-5 py-12 text-center">
                  <KeyRound className="mx-auto mb-3 size-6" />
                  {filter === "expiring" ? `No key ends in the next ${EXPIRING_DAYS} days.` : "No keys yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={confirmRenew}
        onOpenChange={setConfirmRenew}
        title={`Renew ${expiring.length} key${expiring.length === 1 ? "" : "s"}?`}
        description={`Each key that ends in the next ${EXPIRING_DAYS} days, or has ended, is replaced by a new key that runs a full term from today, and emailed to its holder. The old keys stop working, so people paste the new key into MotionQL (Settings → License).`}
        confirmLabel="Renew keys"
        onConfirm={async () => {
          await renew.mutateAsync().catch(() => undefined);
        }}
      />
    </Card>
  );
}
