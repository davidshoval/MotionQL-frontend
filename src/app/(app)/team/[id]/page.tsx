"use client";

import { use, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Activity,
  KeyRound,
  Loader2,
  Mail,
  MoreHorizontal,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { api, ApiError, type Member, type Role } from "@/lib/api";
import { qk } from "@/lib/api/hooks";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/app/user-menu";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { FormError, FormField } from "@/components/app/form-field";

const roleTone: Record<Role, "violet" | "default" | "secondary"> = { owner: "violet", admin: "default", member: "secondary" };

function errText(e: unknown, fallback: string) {
  return e instanceof ApiError ? e.message : fallback;
}

export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const teamQ = useQuery({ queryKey: qk.team(id), queryFn: () => api.team(id).then((r) => r.team) });
  const membersQ = useQuery({ queryKey: qk.members(id), queryFn: () => api.members(id).then((r) => r.members) });
  const isAdmin = teamQ.data?.role === "owner" || teamQ.data?.role === "admin";
  const invitesQ = useQuery({ queryKey: qk.invites(id), queryFn: () => api.invites(id).then((r) => r.invites), enabled: isAdmin });
  const [inviteOpen, setInviteOpen] = useState(false);

  if (teamQ.isError)
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-medium">Team not found</p>
        <p className="text-muted-foreground mt-2">{errText(teamQ.error, "You may not have access to this team.")}</p>
      </div>
    );
  if (!teamQ.data) return <Skeleton className="h-96 rounded-3xl" />;
  const team = teamQ.data;
  const pct = Math.min(100, (team.seats.used / Math.max(1, team.seats.limit)) * 100);

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Users className="size-4" /> Team
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{team.name}</h1>
        </div>
        {isAdmin && (
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus /> Invite people
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Seats in use" value={`${team.seats.used} / ${team.seats.limit}`}>
          <div className="bg-foreground/[0.07] mt-3 h-1.5 overflow-hidden rounded-full">
            <div className={cn("h-full rounded-full", pct > 90 ? "bg-warning" : "bg-primary")} style={{ width: `${pct}%` }} />
          </div>
        </Stat>
        <Stat label="Members" value={String(membersQ.data?.length ?? "–")} />
        <Stat label="Pending invites" value={isAdmin ? String(invitesQ.data?.length ?? "–") : "–"} />
      </div>

      <Tabs defaultValue="members">
        <TabsList className="max-w-full overflow-x-auto">
          <TabsTrigger value="members">
            <Users /> Members
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="invites">
              <Mail /> Invites
              {!!invitesQ.data?.length && (
                <span className="bg-primary/15 text-primary rounded-full px-1.5 text-[11px]">{invitesQ.data.length}</span>
              )}
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="activity">
              <Activity /> Activity
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="settings">
              <Settings /> Settings
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="members">
          <MembersTable teamId={id} members={membersQ.data} loading={membersQ.isLoading} isAdmin={isAdmin} myRole={team.role} />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="invites">
            <InvitesList teamId={id} onInvite={() => setInviteOpen(true)} />
          </TabsContent>
        )}
        {isAdmin && (
          <TabsContent value="activity">
            <AuditLog teamId={id} />
          </TabsContent>
        )}
        {isAdmin && (
          <TabsContent value="settings">
            <TeamSettings teamId={id} name={team.name} />
          </TabsContent>
        )}
      </Tabs>

      <InviteDialog teamId={id} open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}

function Stat({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <Card className="p-5">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {children}
    </Card>
  );
}

type PendingAction = { kind: "remove" | "free" | "reissue"; member: Member } | null;

function MembersTable({
  teamId,
  members,
  loading,
  isAdmin,
  myRole,
}: {
  teamId: string;
  members?: Member[];
  loading: boolean;
  isAdmin: boolean;
  myRole: Role;
}) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["team", teamId] }), qc.invalidateQueries({ queryKey: qk.me })]);

  const assign = useMutation({
    mutationFn: (m: Member) => api.assignSeat(teamId, m.userId!),
    onSuccess: (_r, m) => {
      toast.success(`Seat assigned. ${m.email} gets their key by email.`);
      refresh();
    },
    onError: (e) => toast.error(errText(e, "Couldn't assign a seat.")),
  });
  const setRole = useMutation({
    mutationFn: ({ m, role }: { m: Member; role: Role }) => api.updateMember(teamId, m.userId!, { role }),
    onSuccess: () => {
      toast.success("Role updated");
      refresh();
    },
    onError: (e) => toast.error(errText(e, "Couldn't change the role.")),
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (members ?? []).filter((m) => !s || m.email.includes(s) || (m.name ?? "").toLowerCase().includes(s));
  }, [members, q]);

  async function runPending() {
    if (!pending) return;
    const { kind, member: m } = pending;
    try {
      if (kind === "remove") await api.removeMember(teamId, m.userId!);
      if (kind === "free") await api.freeSeat(teamId, m.userId!);
      if (kind === "reissue") await api.reissueMemberKey(teamId, m.userId!);
      toast.success({ remove: `${m.email} was removed`, free: "Seat freed and key revoked", reissue: `New key sent to ${m.email}` }[kind]);
      await refresh();
    } catch (e) {
      toast.error(errText(e, "That didn't work. Try again."));
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-border flex items-center gap-3 border-b p-4">
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members"
            className="h-9 pl-9 text-sm"
            aria-label="Search members"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-muted-foreground text-left text-xs">
            <tr className="border-border border-b">
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Seat and key</th>
              <th className="px-5 py-3 font-medium">Last seen in app</th>
              {isAdmin && <th className="w-12 px-5 py-3" />}
            </tr>
          </thead>
          <tbody>
            {loading &&
              [0, 1, 2].map((i) => (
                <tr key={i} className="border-border/60 border-b">
                  <td colSpan={5} className="px-5 py-4">
                    <Skeleton className="h-8" />
                  </td>
                </tr>
              ))}
            {filtered.map((m) => (
              <tr key={m.userId ?? m.email} className="border-border/60 hover:bg-foreground/[0.02] border-b last:border-0">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar label={m.name || m.email} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{m.name ?? m.email}</p>
                      {m.name && <p className="text-muted-foreground truncate text-xs">{m.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={roleTone[m.role]} className="capitalize">
                    {m.role}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  {m.seat && m.license ? (
                    <span className="flex items-center gap-2">
                      <KeyRound className="text-primary size-4" />
                      <span>
                        Pro <span className="text-muted-foreground">· until {formatDate(m.license.expiresAt)}</span>
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No seat</span>
                  )}
                </td>
                <td className="text-muted-foreground px-5 py-3.5">
                  {m.lastSeenAt ? (
                    <span>
                      {formatDate(m.lastSeenAt)}
                      <span className="block text-xs">
                        v{m.appVersion} · {m.os}
                        {m.installs && m.installs > 1 ? ` · ${m.installs} installs` : ""}
                      </span>
                    </span>
                  ) : (
                    "No usage data"
                  )}
                </td>
                {isAdmin && (
                  <td className="px-5 py-3.5 text-right">
                    {m.role !== "owner" || myRole === "owner" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${m.email}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {m.seat ? (
                            <>
                              <DropdownMenuItem onSelect={() => setPending({ kind: "reissue", member: m })}>
                                <RotateCcw /> Reissue key
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setPending({ kind: "free", member: m })}>
                                <KeyRound /> Free seat
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem onSelect={() => assign.mutate(m)}>
                              <KeyRound /> Assign seat
                            </DropdownMenuItem>
                          )}
                          {m.role !== "owner" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => setRole.mutate({ m, role: m.role === "admin" ? "member" : "admin" })}>
                                <ShieldCheck /> {m.role === "admin" ? "Make member" : "Make admin"}
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive" onSelect={() => setPending({ kind: "remove", member: m })}>
                                <UserMinus /> Remove from team
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </td>
                )}
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-5 py-12 text-center">
                  {q ? "No members match your search." : "No members yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        destructive={pending?.kind !== "reissue"}
        title={
          pending?.kind === "remove"
            ? `Remove ${pending.member.email}?`
            : pending?.kind === "free"
              ? `Free ${pending?.member.email}'s seat?`
              : `Reissue ${pending?.member.email}'s key?`
        }
        description={
          pending?.kind === "remove"
            ? "Their seat is freed and their key is revoked. XQuery drops to the free tier on their machine within about 4 hours. Their own account stays."
            : pending?.kind === "free"
              ? "Their key is revoked and the seat becomes available. They stay on the team."
              : "They get a new key by email and the current one is revoked. Use this when a key was lost or shared."
        }
        confirmLabel={pending?.kind === "remove" ? "Remove" : pending?.kind === "free" ? "Free seat" : "Reissue key"}
        onConfirm={runPending}
      />
    </Card>
  );
}

function InvitesList({ teamId, onInvite }: { teamId: string; onInvite: () => void }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: qk.invites(teamId), queryFn: () => api.invites(teamId).then((r) => r.invites) });
  const cancel = useMutation({
    mutationFn: (inviteId: string) => api.cancelInvite(teamId, inviteId),
    onSuccess: () => {
      toast.success("Invite cancelled");
      qc.invalidateQueries({ queryKey: ["team", teamId] });
    },
    onError: (e) => toast.error(errText(e, "Couldn't cancel the invite.")),
  });
  const resend = useMutation({
    mutationFn: (inviteId: string) => api.resendInvite(teamId, inviteId),
    onSuccess: () => toast.success("Invite sent again"),
    onError: (e) => toast.error(errText(e, "Couldn't resend the invite.")),
  });

  if (isLoading) return <Skeleton className="h-40 rounded-2xl" />;
  if (!data?.length)
    return (
      <Card className="p-10 text-center">
        <Mail className="text-muted-foreground mx-auto size-8" />
        <p className="mt-4 font-medium">No pending invites</p>
        <p className="text-muted-foreground mt-1 text-sm">Invite teammates by email; they&apos;ll get their own key when they join.</p>
        <Button className="mt-6" onClick={onInvite}>
          <UserPlus /> Invite people
        </Button>
      </Card>
    );
  return (
    <Card className="divide-border divide-y">
      {data.map((inv) => (
        <div key={inv.id} className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm">
          <Avatar label={inv.email} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{inv.email}</p>
            <p className="text-muted-foreground text-xs">
              Invited {formatDate(inv.createdAt)} · expires {formatDate(inv.expiresAt)} · {inv.assignSeat ? "gets a seat" : "no seat"}
            </p>
          </div>
          <Badge variant={roleTone[inv.role]} className="capitalize">
            {inv.role}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => resend.mutate(inv.id)} disabled={resend.isPending}>
            <Send /> Resend
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => cancel.mutate(inv.id)}
            disabled={cancel.isPending}
            className="text-destructive hover:text-destructive"
          >
            <X /> Cancel
          </Button>
        </div>
      ))}
    </Card>
  );
}

const actionText: Record<string, string> = {
  "team.created": "created the team",
  "team.renamed": "renamed the team",
  "invite.sent": "invited",
  "invite.resent": "re-sent an invite to",
  "invite.cancelled": "cancelled the invite for",
  "member.joined": "joined:",
  "member.removed": "removed",
  "member.role_changed": "changed the role of",
  "seat.assigned": "assigned a seat to",
  "seat.freed": "freed the seat of",
  "license.reissued": "reissued the key of",
};

function AuditLog({ teamId }: { teamId: string }) {
  const { data, isLoading } = useQuery({ queryKey: qk.audit(teamId), queryFn: () => api.audit(teamId) });
  function exportCsv() {
    const rows = [["time", "actor", "action", "target"], ...(data?.events ?? []).map((e) => [e.at, e.actor.email, e.action, e.target])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "xquery-team-audit.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  if (isLoading) return <Skeleton className="h-40 rounded-2xl" />;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Every invite, seat change, key and role change, with who did it.</CardDescription>
        </div>
        <Button variant="secondary" size="sm" onClick={exportCsv} disabled={!data?.events.length}>
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {data?.events.length ? (
          <ol className="border-border relative space-y-5 border-l pl-6">
            {data.events.map((e) => (
              <li key={e.id} className="relative text-sm">
                <span className="border-background bg-primary absolute top-1.5 -left-[1.82rem] size-2.5 rounded-full border-2" />
                <p>
                  <span className="font-medium">{e.actor.email}</span>{" "}
                  <span className="text-muted-foreground">{actionText[e.action] ?? e.action}</span>{" "}
                  <span className="font-medium">{e.target}</span>
                </p>
                <p className="text-muted-foreground text-xs">{formatDate(e.at, { dateStyle: "medium", timeStyle: "short" })}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground text-sm">Nothing yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function TeamSettings({ teamId, name }: { teamId: string; name: string }) {
  const qc = useQueryClient();
  const [value, setValue] = useState(name);
  const save = useMutation({
    mutationFn: () => api.renameTeam(teamId, value.trim()),
    onSuccess: () => {
      toast.success("Team renamed");
      qc.invalidateQueries({ queryKey: ["team", teamId] });
      qc.invalidateQueries({ queryKey: qk.me });
    },
    onError: (e) => toast.error(errText(e, "Couldn't rename the team.")),
  });
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Team name</CardTitle>
          <CardDescription>Shown to members and in their license as the customer name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex max-w-lg gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim()) save.mutate();
            }}
          >
            <Input value={value} onChange={(e) => setValue(e.target.value)} aria-label="Team name" />
            <Button type="submit" variant="secondary" disabled={save.isPending || value.trim() === name}>
              {save.isPending && <Loader2 className="animate-spin" />}
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Company domain</CardTitle>
          <CardDescription>Coming soon: verify your domain so anyone who signs up with it joins this team automatically.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function InviteDialog({ teamId, open, onOpenChange }: { teamId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const qc = useQueryClient();
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [assignSeat, setAssignSeat] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const parsed = emails
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const invalid = parsed.filter((s) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s));

  const send = useMutation({
    mutationFn: () => api.invite(teamId, { emails: parsed, role, assignSeat }),
    onSuccess: ({ invites }) => {
      toast.success(
        invites.length
          ? `Sent ${invites.length} invite${invites.length > 1 ? "s" : ""}`
          : "Those people are already invited or on the team.",
      );
      qc.invalidateQueries({ queryKey: ["team", teamId] });
      setEmails("");
      onOpenChange(false);
    },
    onError: (e) => setError(errText(e, "Couldn't send the invites.")),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite people</DialogTitle>
          <DialogDescription>
            Paste one or more emails. Each person gets an invite link and, with a seat, their own Pro key.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (!parsed.length) return setError("Add at least one email.");
            if (invalid.length) return setError(`These don't look like emails: ${invalid.join(", ")}`);
            send.mutate();
          }}
        >
          <FormError message={error} />
          <FormField
            id="invite-emails"
            label="Emails"
            hint={parsed.length ? `${parsed.length} address${parsed.length > 1 ? "es" : ""}` : "Separate with commas, spaces or new lines."}
          >
            <textarea
              id="invite-emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={4}
              placeholder={"maya@acme.io, jordan@acme.io"}
              className="border-input bg-foreground/[0.03] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/25 w-full rounded-lg border px-3.5 py-2.5 text-[15px] outline-none focus-visible:ring-3"
            />
          </FormField>
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-sm font-medium">Role</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["member", "admin"] as const).map((r) => (
                <label
                  key={r}
                  className={cn(
                    "cursor-pointer rounded-xl border p-3 text-sm transition",
                    role === r ? "border-primary/60 bg-primary/[0.07]" : "border-border hover:border-foreground/20",
                  )}
                >
                  <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                  <span className="font-medium capitalize">{r}</span>
                  <span className="text-muted-foreground mt-0.5 block text-xs">
                    {r === "member" ? "Uses their own key" : "Can invite, assign seats and remove people"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={assignSeat}
              onChange={(e) => setAssignSeat(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Give them a seat and a Pro key when they join
          </label>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={send.isPending}>
              {send.isPending ? <Loader2 className="animate-spin" /> : <Send />}
              Send invites
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
