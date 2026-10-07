"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { api, ApiError, type AcquisitionSource } from "@/lib/api";
import { useMe } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const columns: { key: keyof Omit<AcquisitionSource, "utmSource">; label: string; title: string }[] = [
  { key: "signups", label: "Sign-ups", title: "Accounts created in the range" },
  { key: "confirmed", label: "Confirmed", title: "Confirmed their e-mail" },
  { key: "companies", label: "Companies", title: "Distinct company e-mail domains (gmail.com and other personal mailboxes left out)" },
  { key: "companies2Plus", label: "2+ users", title: "Companies with 2 or more accounts at their domain" },
  { key: "companies3Plus", label: "3+ users", title: "Companies with 3 or more accounts at their domain" },
  { key: "activated", label: "Activated", title: "Users whose key has been seen in the app" },
];

/** Staff only: sign-ups per first-touch utm_source (GET /admin/acquisition). */
export default function AcquisitionPage() {
  const { data: me } = useMe();
  const [draft, setDraft] = useState({ from: "", to: "" });
  const [range, setRange] = useState({ from: "", to: "" });
  const isStaff = !!me?.user.isStaff;
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "acquisition", range],
    queryFn: () => api.acquisition({ from: range.from || undefined, to: range.to || undefined }),
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

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Acquisition</h1>
        <p className="text-muted-foreground mt-2">
          Sign-ups by the utm_source of the visitor&apos;s first page. Companies are counted by e-mail domain; a company&apos;s size is
          every account at its domain, whatever brought them in.
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setRange(draft);
        }}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="acq-from">From</Label>
          <Input id="acq-from" type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="acq-to">To (not included)</Label>
          <Input id="acq-to" type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
        </div>
        <Button type="submit">Show</Button>
        {(range.from || range.to) && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setDraft({ from: "", to: "" });
              setRange({ from: "", to: "" });
            }}
          >
            All time
          </Button>
        )}
      </form>

      {error ? (
        <p className="text-destructive">{error instanceof ApiError ? error.message : "Could not load the report."}</p>
      ) : isLoading || !data ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            {(
              [
                ["Sign-ups", data.totals.signups],
                ["Confirmed", data.totals.confirmed],
                ["Companies", data.totals.companies],
                ["Activated", data.totals.activated],
              ] as const
            ).map(([label, value]) => (
              <Card key={label}>
                <CardHeader>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground border-border border-b text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">utm_source</th>
                    {columns.map((c) => (
                      <th key={c.key} className="px-5 py-3 text-right font-medium" title={c.title}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {data.sources.length === 0 && (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-muted-foreground px-5 py-8 text-center">
                        No sign-ups in this range.
                      </td>
                    </tr>
                  )}
                  {data.sources.map((s) => (
                    <tr key={s.utmSource ?? "(none)"}>
                      <td className="px-5 py-3 font-mono">{s.utmSource ?? <span className="text-muted-foreground">(none)</span>}</td>
                      {columns.map((c) => (
                        <td key={c.key} className="px-5 py-3 text-right tabular-nums">
                          {s[c.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
