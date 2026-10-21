"use client";

import { use, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Activity,
  ArrowRightLeft,
  Copy,
  Crown,
  Link2,
  KeyRound,
  LogOut,
  Trash2,
  Loader2,
  Mail,
  MoreHorizontal,
  RefreshCw,
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
import { CopyButton } from "@/components/app/copy-button";
import { FormError, FormField } from "@/components/app/form-field";
import { AddPeopleDialog, ReassignDialog } from "./add-people-dialog";
import { LicensesPanel } from "./licenses-panel";
import { daysLeftText, keyState, keyStateBadge, maskKey } from "./license-utils";

const roleTone: Record<Role, "violet" | "default" | "secondary"> = { owner: "violet", admin: "default", member: "secondary" };

function errText(e: unknown, fallback: string) {
  return e instanceof ApiError ? e.message : fallback;
}

/** What member routes take: the account id when there is one (any backend), else the member id. */
const ref = (m: Member) => m.userId ?? m.memberId;

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
  const [addOpen, setAddOpen] = useState(false);

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
  const freeSeats = Math.max(0, team.seatLimit - team.seatsUsed);
  const expiring = (membersQ.data ?? []).filter((m) => m.license && ["expiring", "expired"].includes(keyState(m.license))).length;

  return (
    <div className="grid grid-cols-1 gap-8 [&>*]:min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Users className="size-4" /> Team
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{team.name}</h1>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setInviteOpen(true)}>
              <Mail /> Invite by email
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <UserPlus /> Add people
            </Button>
          </div>
        )}
      </div>

      {welcome && isAdmin && (
        <div className="border-primary/30 bg-primary/[0.06] flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-5 py-4">
          <div>
            <p className="font-medium">Your team is ready, and you&apos;re its manager.</p>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Add your teammates by email and each one gets their own Pro key right away, with nothing to accept. You see every key and when
              it ends, and can renew, reassign or revoke it any time.
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus /> Add your team
          </Button>
        </div>
      )}

      <div className={cn("grid gap-4 sm:grid-cols-2", isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        <Stat label="Seats in use" value={`${team.seatsUsed} / ${team.seatLimit}`}>
          <div className="bg-foreground/[0.07] mt-3 h-1.5 overflow-hidden rounded-full">
            <div className={cn("h-full rounded-full", pct > 90 ? "bg-warning" : "bg-primary")} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-muted-foreground mt-2 text-xs">{freeSeats} free · more seats on request</p>
        </Stat>
        <Stat label="Members" value={String(membersQ.data?.length ?? "–")} />
        {isAdmin && (
          <Stat label={`Keys ending in 30 days`} value={membersQ.data ? String(expiring) : "–"} tone={expiring ? "warning" : undefined} />
        )}
        <Stat label="Pending invites" value={isAdmin ? String(invitesQ.data?.length ?? "–") : "–"} />
      </div>

      <Tabs defaultValue="members">
        <TabsList className="max-w-full overflow-x-auto">
          <TabsTrigger value="members">
            <Users /> Members
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="licenses">
              <KeyRound /> Licenses
              {expiring > 0 && <span className="bg-warning/15 text-warning rounded-full px-1.5 text-[11px]">{expiring}</span>}
            </TabsTrigger>
          )}
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
          <TabsContent value="licenses">
            <LicensesPanel teamId={id} />
          </TabsContent>
        )}
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
      {isAdmin && (
        <AddPeopleDialog teamId={id} teamName={team.name} freeSeats={freeSeats} myRole={role} open={addOpen} onOpenChange={setAddOpen} />
      )}
    </div>
  );
}

function Stat({ label, value, tone, children }: { label: string; value: string; tone?: "warning"; children?: React.ReactNode }) {
  return (
    <Card className="p-5">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tracking-tight tabular-nums", tone === "warning" && "text-warning")}>{value}</p>
      {children}
    </Card>
  );
}

type PendingAction = { kind: "remove" | "free" | "reissue" | "renew" | "owner"; member: Member } | null;

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
  const [reassignFrom, setReassignFrom] = useState<Member | null>(null);
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ["team", teamId] }), qc.invalidateQueries({ queryKey: qk.me })]);

  const assign = useMutation({
    mutationFn: (m: Member) => api.assignSeat(teamId, ref(m)),
    onSuccess: (_r, m) => {
      toast.success(`Seat assigned. ${m.email} gets their key by email${m.hasAccount ? " and in their account" : ""}.`);
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
    mutationFn: ({ m, role }: { m: Member; role: "admin" | "member" }) => api.updateMember(teamId, ref(m), { role }),
    onSuccess: () => {
      toast.success("Role updated");
      refresh();
    },
    onError: (e) => toast.error(errText(e, "Couldn't change the role.")),
  });
  const sendKey = useMutation({
    mutationFn: (m: Member) => api.sendMemberKey(teamId, ref(m)),
    onSuccess: (_r, m) => toast.success(`Key emailed to ${m.email}`),
    onError: (e) => toast.error(errText(e, "Couldn't send the key.")),
  });
  const copyKey = (m: Member) =>
    m.license?.key &&
    navigator.clipboard
      .writeText(m.license.key)
      .then(() => toast.success(`Key for ${m.email} copied`))
      .catch(() => toast.error("Couldn't copy. Use the Licenses tab and copy it from there."));

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (members ?? []).filter((m) => !s || m.email.includes(s) || (m.name ?? "").toLowerCase().includes(s));
  }, [members, q]);

  async function runPending() {
    if (!pending) return;
    const { kind, member: m } = pending;
    try {
      if (kind === "remove") await api.removeMember(teamId, ref(m));
      if (kind === "free") await api.freeSeat(teamId, ref(m));
      if (kind === "reissue") await api.reissueMemberKey(teamId, ref(m));
      if (kind === "renew") await api.renewMemberKey(teamId, ref(m));
      if (kind === "owner") await api.transferOwnership(teamId, m.userId!);
      toast.success(
        {
          remove: `${m.email} was removed`,
          free: "Seat freed and key revoked",
          reissue: `New key sent to ${m.email}`,
          renew: `Renewed. ${m.email} was emailed their new key.`,
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
              <th className="px-5 py-3 font-medium">License</th>
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
              <tr key={m.memberId} className="border-border/60 hover:bg-foreground/[0.02] border-b last:border-0">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar label={m.name || m.email} />
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-medium">
                        <span className="truncate">{m.name || m.email}</span>
                        {isAdmin && !m.hasAccount && (
                          <Badge
                            variant="secondary"
                            title="Added by email. They use the key they were sent; it links to their account if they sign up."
                          >
                            No account
                          </Badge>
                        )}
                      </p>
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
                  {m.hasSeat && m.license ? <LicenseCell license={m.license} /> : <span className="text-muted-foreground">No seat</span>}
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
                              {m.license?.key && (
                                <DropdownMenuItem onSelect={() => copyKey(m)}>
                                  <Copy /> Copy key
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onSelect={() => sendKey.mutate(m)}>
                                <Send /> Email key again
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setPending({ kind: "renew", member: m })}>
                                <RefreshCw /> Renew key
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setPending({ kind: "reissue", member: m })}>
                                <RotateCcw /> Reissue key
                              </DropdownMenuItem>
                              {m.role !== "owner" && (
                                <DropdownMenuItem onSelect={() => setReassignFrom(m)}>
                                  <ArrowRightLeft /> Give seat to someone else
                                </DropdownMenuItem>
                              )}
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
                                  <DropdownMenuItem disabled={!m.hasAccount} onSelect={() => setPending({ kind: "owner", member: m })}>
                                    <Crown /> {m.hasAccount ? "Make owner" : "Make owner (needs an account)"}
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
      <ReassignDialog teamId={teamId} from={reassignFrom} onOpenChange={(o) => !o && setReassignFrom(null)} />
    </Card>
  );
}

/** Status, end date and (for admins) the key itself, masked, with a copy button. */
function LicenseCell({ license }: { license: NonNullable<Member["license"]> }) {
  const state = keyState(license);
  return (
    <div className="grid gap-1">
      <span className="flex flex-wrap items-center gap-2">
        <Badge variant={keyStateBadge[state].variant}>{keyStateBadge[state].label}</Badge>
        <span className="capitalize">{license.edition}</span>
      </span>
      <span className={cn("text-xs", state === "active" ? "text-muted-foreground" : "text-warning")}>
        Until {formatDate(license.expiresAt)} · {daysLeftText(license.expiresAt)}
      </span>
      {license.key && (
        <span className="flex items-center gap-1">
          <code className="text-muted-foreground font-mono text-xs">{maskKey(license.key)}</code>
          <CopyButton
            value={license.key}
            label=""
            aria-label="Copy key"
            toastText="Key copied"
            variant="ghost"
            size="icon"
            className="size-7"
          />
        </span>
      )}
    </div>
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
  renew: {
    title: (e) => `Renew ${e}'s key?`,
    description:
      "They get a new key that runs a full term from today, by email. Their current key stops working within about 4 hours, so they paste the new one into MotionQL (Settings → License).",
    label: "Renew key",
  },
  reissue: {
    title: (e) => `Reissue ${e}'s key?`,
    description: "They get a new key with the same end date and the current one stops working. Use this when a key was lost or shared.",
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
        <p className="text-muted-foreground mt-1 text-sm">
          Invites are optional: people you add directly get their key at once. Invited people get their key when they accept.
        </p>
        <Button className="mt-6" variant="secondary" onClick={onInvite}>
          <Mail /> Invite by email
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
  "team.member.add": "added",
  "team.member.link": "linked their account:",
  "team.member.leave": "left the team",
  "team.seat.renew": "renewed the key of",
  "team.seat.reassign": "gave away the seat of",
  "team.key.send": "emailed the key to",
  "license.revoke": "revoked a key of",
  "license.replace": "replaced a key of",
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
          <CardDescription>Every person added, seat change, key and role change, with who did it.</CardDescription>
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
          <DialogTitle>Invite by email</DialogTitle>
          <DialogDescription>
            Each person gets a link to join with their MotionQL account and, with a seat, their own Pro key when they accept. To give people
            a key straight away instead, use Add people.
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
