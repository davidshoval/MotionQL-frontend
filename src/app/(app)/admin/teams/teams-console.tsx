"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, Search, ShieldAlert } from "lucide-react";
import { api, ApiError, type Team } from "@/lib/api";
import { useMe } from "@/lib/api/hooks";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

/** Staff only: every team's seats, with requests for more seats first (GET /admin/teams). */
export function TeamsConsole() {
  const { data: me } = useMe();
  const initial = useSearchParams().get("q") ?? "";
  const [draft, setDraft] = useState(initial);
  const [q, setQ] = useState(initial);
  const isStaff = !!me?.user.isStaff;
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "teams", q],
    queryFn: () => api.adminTeams(q || undefined).then((r) => r.teams),
    enabled: isStaff,
    retry: false,
  });

  if (!me) return null;
  if (!isStaff)
    return (
      <div className="mx-auto grid max-w-md justify-items-center gap-3 py-24 text-center">
        <ShieldAlert className="text-muted-foreground size-8" />
        <h1 className="text-xl font-semibold">Staff only</h1>
        <p className="text-muted-foreground">This page is for the MotionQL team.</p>
      </div>
    );

  const pending = data?.filter((t) => t.seatRequest).length ?? 0;
  return (
    <div className="grid grid-cols-1 gap-8 [&>*]:min-w-0">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
        <p className="text-muted-foreground mt-2">
          Seat limits for every team. Teams that asked for more seats come first{pending ? ` (${pending} waiting)` : ""}.
        </p>
      </div>
      <form
        className="flex max-w-lg gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setQ(draft.trim());
        }}
      >
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Team name or id"
            className="pl-9"
            aria-label="Search teams"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
      {error ? (
        <p className="text-destructive">{error instanceof ApiError ? error.message : "Couldn't load teams."}</p>
      ) : isLoading ? (
        <Skeleton className="h-60 rounded-2xl" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-muted-foreground text-left text-xs">
                <tr className="border-border border-b">
                  <th className="px-5 py-3 font-medium">Team</th>
                  <th className="px-5 py-3 font-medium">Seats used</th>
                  <th className="px-5 py-3 font-medium">Request</th>
                  <th className="px-5 py-3 font-medium">Seat limit</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((t) => (
                  <TeamRow key={t.id} team={t} />
                ))}
                {!data?.length && (
                  <tr>
                    <td colSpan={4} className="text-muted-foreground px-5 py-12 text-center">
                      No teams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function TeamRow({ team }: { team: Team }) {
  const qc = useQueryClient();
  const [limit, setLimit] = useState(String(team.seatLimit));
  const save = useMutation({
    mutationFn: (seatLimit: number) => api.updateTeamLimits(team.id, { seatLimit }),
    onSuccess: ({ team: t }) => {
      toast.success(`${t.name} now has ${t.seatLimit} seats`);
      setLimit(String(t.seatLimit));
      qc.invalidateQueries({ queryKey: ["admin", "teams"] });
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Couldn't save the limit."),
  });
  const n = Number(limit);
  return (
    <tr className="border-border/60 border-b align-top last:border-0">
      <td className="px-5 py-3.5">
        <p className="font-medium">{team.name}</p>
        <p className="text-muted-foreground font-mono text-xs">{team.id}</p>
      </td>
      <td className="px-5 py-3.5 tabular-nums">
        {team.seatsUsed} / {team.seatLimit}
      </td>
      <td className="px-5 py-3.5">
        {team.seatRequest ? (
          <div className="grid gap-1">
            <span className="flex items-center gap-2">
              <Badge variant="warning">{team.seatRequest.seats} seats</Badge>
              <Button size="sm" variant="secondary" disabled={save.isPending} onClick={() => save.mutate(team.seatRequest!.seats)}>
                <Check /> Approve
              </Button>
            </span>
            <span className="text-muted-foreground text-xs">
              {team.seatRequest.by} · {formatDate(team.seatRequest.at)}
            </span>
            {team.seatRequest.note && <span className="text-xs">“{team.seatRequest.note}”</span>}
          </div>
        ) : (
          <span className="text-muted-foreground">None</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (Number.isInteger(n) && n >= 1) save.mutate(n);
          }}
        >
          <Input
            type="number"
            min={Math.max(1, team.seatsUsed)}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="h-9 w-24"
            aria-label={`Seat limit for ${team.name}`}
          />
          <Button type="submit" size="sm" variant="ghost" disabled={save.isPending || n === team.seatLimit}>
            {save.isPending && <Loader2 className="animate-spin" />}
            Save
          </Button>
        </form>
      </td>
    </tr>
  );
}
