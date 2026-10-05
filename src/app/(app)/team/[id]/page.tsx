"use client";

import { use, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Activity,
  Crown,
  Link2,
  KeyRound,
  LogOut,
  Trash2,
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
import { api, ApiError, USE_MOCK, type AuditEvent, type Member, type Role } from "@/lib/api";
import { mockInviteLink } from "@/lib/api/mock";
import { qk, useMe } from "@/lib/api/hooks";
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
  const teamQ = useQuery({ queryKey: qk.team(id), queryFn: () => api.team(id) });
  const membersQ = useQuery({ queryKey: qk.members(id), queryFn: () => api.members(id).then((r) => r.members) });
  const myRole = teamQ.data?.role;
  const isAdmin = myRole === "owner" || myRole === "admin";
  const invitesQ = useQuery({ queryKey: qk.invites(id), queryFn: () => api.invites(id).then((r) => r.invites), enabled: isAdmin });
  // New team managers land here straight from sign-up.
  const welcome = useSearchParams().get("welcome") === "1";
  const [inviteOpen, setInviteOpen] = useState(false);

  if (teamQ.isError)
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-medium">Team not found</p>
        <p className="text-muted-foreground mt-2">{errText(teamQ.error, "You may not have access to this team.")}</p>
      </div>
    );
  if (!teamQ.data) return <Skeleton className="h-96 rounded-3xl" />;
  const { team, role } = teamQ.data;
  const pct = Math.min(100, (team.seatsUsed / Math.max(1, team.seatLimit)) * 100);

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

      {welcome && isAdmin && (
        <div className="border-primary/30 bg-primary/[0.06] flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-5 py-4">
          <div>
            <p className="font-medium">Your team is ready, and you&apos;re its manager.</p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Invite your teammates by email. Each one gets their own Pro key, and you can free a seat or reissue a key any time.
            </p>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus /> Invite your team
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Seats in use" value={`${team.seatsUsed} / ${team.seatLimit}`}>
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
          <TabsTrigger value="settings">
            <Settings /> Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <MembersTable teamId={id} members={membersQ.data} loading={membersQ.isLoading} isAdmin={isAdmin} myRole={role} />
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
        <TabsContent value="settings">
          <TeamSettings teamId={id} name={team.name} role={role} />
        </TabsContent>
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

type PendingAction = { kind: "remove" | "free" | "reissue" | "owner"; member: Member } | null;

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
      toast.success(`Seat assigned. ${m.email} gets their key by email and in their account.`);
      refresh();
    },
    onError: (e) =>
      toast.error(
        e instanceof ApiError && e.code === "seat_limit_reached"
          ? "Every seat is taken. Free one first."
          : errText(e, "Couldn't assign a seat."),
      ),
  });
  const setRole = useMutation({
    mutationFn: ({ m, role }: { m: Member; role: "admin" | "member" }) => api.updateMember(teamId, m.userId!, { role }),
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
      if (kind === "owner") await api.transferOwnership(teamId, m.userId!);
      toast.success(
        {
          remove: `${m.email} was removed`,
          free: "Seat freed and key revoked",
          reissue: `New key sent to ${m.email}`,
          owner: `${m.email} now owns the team. You're an admin.`,
        }[kind],
      );
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
                  {m.hasSeat && m.license ? (
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
                  {m.usage?.lastSeen ? (
                    <span>
                      {formatDate(m.usage.lastSeen)}
                      <span className="block text-xs">
                        v{m.usage.appVersion} · {m.usage.platform}
                        {m.usage.installs > 1 ? ` · ${m.usage.installs} installs` : ""}
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
                          {m.hasSeat ? (
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
                              {myRole === "owner" && (
                                <>
                                  <DropdownMenuItem onSelect={() => setRole.mutate({ m, role: m.role === "admin" ? "member" : "admin" })}>
                                    <ShieldCheck /> {m.role === "admin" ? "Make member" : "Make admin"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => setPending({ kind: "owner", member: m })}>
                                    <Crown /> Make owner
                                  </DropdownMenuItem>
                                </>
                              )}
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
        destructive={pending?.kind === "remove" || pending?.kind === "free"}
        title={pending ? confirmCopy[pending.kind].title(pending.member.email) : ""}
        description={pending ? confirmCopy[pending.kind].description : ""}
        confirmLabel={pending ? confirmCopy[pending.kind].label : ""}
        onConfirm={runPending}
      />
    </Card>
  );
}

const confirmCopy: Record<NonNullable<PendingAction>["kind"], { title: (email: string) => string; description: string; label: string }> = {
  remove: {
    title: (e) => `Remove ${e}?`,
    description:
      "Their seat is freed and their key is revoked. MotionQL drops to the free tier on their machine within about 4 hours. Their own account stays.",
    label: "Remove",
  },
  free: {
    title: (e) => `Free ${e}'s seat?`,
    description: "Their key is revoked and the seat becomes available. They stay on the team.",
    label: "Free seat",
  },
  reissue: {
    title: (e) => `Reissue ${e}'s key?`,
    description: "They get a new key and the current one stops working. Use this when a key was lost or shared.",
    label: "Reissue key",
  },
  owner: {
    title: (e) => `Make ${e} the owner?`,
    description: "They get full control of the team, including deleting it. You stay on the team as an admin.",
    label: "Transfer ownership",
  },
};

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
              Invited by {inv.invitedBy} on {formatDate(inv.createdAt)} · expires {formatDate(inv.expiresAt)} ·{" "}
              {inv.assignSeat ? "gets a seat" : "no seat"}
            </p>
          </div>
          <Badge variant={roleTone[inv.role]} className="capitalize">
            {inv.role}
          </Badge>
          {USE_MOCK && (
            <Button
              variant="ghost"
              size="sm"
              title="Preview mode: no e-mail is sent, so copy the link the invitee would get"
              onClick={() => {
                const link = mockInviteLink(inv.id);
                if (link)
                  navigator.clipboard
                    .writeText(new URL(link, window.location.origin).toString())
                    .then(() => toast.success("Invite link copied"));
              }}
            >
              <Link2 /> Copy link
            </Button>
          )}
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
  "team.create": "created the team",
  "team.rename": "renamed the team",
  "team.transfer_ownership": "made the owner:",
  "team.invite.create": "invited",
  "team.invite.resend": "re-sent an invite to",
  "team.invite.cancel": "cancelled the invite for",
  "team.invite.accept": "joined the team",
  "team.member.role": "changed the role of",
  "team.member.plan": "changed the plan of",
  "team.member.remove": "removed",
  "team.seat.assign": "assigned a seat to",
  "team.seat.free": "freed the seat of",
  "license.issue": "issued a key for",
};

const targetText = (e: AuditEvent) => (e.target?.type === "team" ? "" : (e.target?.email ?? e.target?.name ?? ""));

function AuditLog({ teamId }: { teamId: string }) {
  const { data, isLoading } = useQuery({ queryKey: qk.audit(teamId), queryFn: () => api.audit(teamId) });
  function exportCsv() {
    const url = api.auditCsvUrl(teamId);
    if (url) return window.location.assign(url);
    const rows = [
      ["time", "actor", "action", "target"],
      ...(data?.events ?? []).map((e) => [e.at, e.actor?.email ?? "MotionQL", e.action, targetText(e)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "motionql-team-audit.csv";
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
                  <span className="font-medium">{e.actor?.email ?? "MotionQL"}</span>{" "}
                  <span className="text-muted-foreground">{actionText[e.action] ?? e.action}</span>{" "}
                  <span className="font-medium">{targetText(e)}</span>
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

function TeamSettings({ teamId, name, role }: { teamId: string; name: string; role: Role }) {
  const qc = useQueryClient();
  const router = useRouter();
  const me = useMe();
  const [confirm, setConfirm] = useState<"delete" | "leave" | null>(null);
  const leaveOrDelete = async () => {
    try {
      if (confirm === "delete") await api.deleteTeam(teamId);
      else if (me.data) await api.removeMember(teamId, me.data.user.id);
      toast.success(confirm === "delete" ? "Team deleted" : "You left the team");
      await qc.invalidateQueries({ queryKey: qk.me });
      router.replace("/account");
    } catch (e) {
      toast.error(errText(e, "That didn't work. Try again."));
    }
  };
  const danger = (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle>{role === "owner" ? "Delete team" : "Leave team"}</CardTitle>
        <CardDescription>
          {role === "owner"
            ? "Revokes every team key and removes all members. To keep the team, make someone else the owner first."
            : "Your team seat is freed and its key stops working. Your own free key is not affected."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => setConfirm(role === "owner" ? "delete" : "leave")}>
          {role === "owner" ? <Trash2 /> : <LogOut />}
          {role === "owner" ? "Delete team" : "Leave team"}
        </Button>
      </CardContent>
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        destructive
        title={confirm === "delete" ? `Delete ${name}?` : `Leave ${name}?`}
        description={confirm === "delete" ? "This can't be undone." : "An admin can invite you again later."}
        typeToConfirm={confirm === "delete" ? name : undefined}
        confirmLabel={confirm === "delete" ? "Delete team" : "Leave team"}
        onConfirm={leaveOrDelete}
      />
    </Card>
  );
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
  if (role === "member") return <div className="grid gap-6">{danger}</div>;
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
      {role === "owner" && danger}
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
    onSuccess: ({ invites, skipped }) => {
      const skippedText = skipped.length
        ? `Skipped ${skipped.map((s) => s.email).join(", ")} (already invited or on the team).`
        : undefined;
      if (invites.length) toast.success(`Sent ${invites.length} invite${invites.length > 1 ? "s" : ""}`, { description: skippedText });
      else toast.info(skippedText ?? "Nothing to send.");
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
