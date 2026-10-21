"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardPaste, Download, KeyRound, Loader2, Plus, UserPlus, X } from "lucide-react";
import { api, ApiError, type Member, type Role } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/app/copy-button";
import { FormError, FormField } from "@/components/app/form-field";
import { downloadText, keysCsv, maskKey, parsePeople, who } from "./license-utils";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Row = { id: number; name: string; email: string };

/** Name and email fields, one line per person; the email is optional. */
function PeopleRows({ rows, setRows, invalidIds }: { rows: Row[]; setRows: (r: Row[]) => void; invalidIds: Set<number> }) {
  const next = useRef(rows.length);
  const update = (id: number, patch: Partial<Row>) => setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  return (
    <div className="grid gap-2">
      <div className="text-muted-foreground grid grid-cols-[1fr_1fr_2.25rem] gap-2 text-xs font-medium">
        <span>Name</span>
        <span>Email (optional)</span>
      </div>
      {rows.map((r, i) => (
        <div key={r.id} className="grid grid-cols-[1fr_1fr_2.25rem] items-center gap-2">
          <Input
            aria-label={`Name ${i + 1}`}
            value={r.name}
            placeholder={i === 0 ? "Maya Cohen" : undefined}
            autoComplete="off"
            onChange={(e) => update(r.id, { name: e.target.value })}
          />
          <Input
            aria-label={`Email ${i + 1}`}
            type="email"
            value={r.email}
            placeholder={i === 0 ? "maya@acme.io" : undefined}
            autoComplete="off"
            aria-invalid={invalidIds.has(r.id) || undefined}
            className={cn(invalidIds.has(r.id) && "border-destructive")}
            onChange={(e) => update(r.id, { email: e.target.value })}
          />
          {rows.length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove person ${i + 1}`}
              onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
            >
              <X />
            </Button>
          ) : (
            <span />
          )}
        </div>
      ))}
      <div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setRows([...rows, { id: next.current++, name: "", email: "" }])}>
          <Plus /> Add another person
        </Button>
      </div>
    </div>
  );
}

/** Rows that have something typed in, as people to add, plus the ids whose email doesn't look right. */
function readRows(rows: Row[]) {
  const filled = rows.filter((r) => r.name.trim() || r.email.trim());
  const invalid = new Set(filled.filter((r) => r.email.trim() && !EMAIL_OK.test(r.email.trim())).map((r) => r.id));
  const seen = new Set<string>();
  const people = filled
    .map((r) => ({ ...(r.name.trim() ? { name: r.name.trim() } : {}), ...(r.email.trim() ? { email: r.email.trim().toLowerCase() } : {}) }))
    .filter((p) => !p.email || (!seen.has(p.email) && seen.add(p.email)));
  return { people, invalid };
}

/**
 * The IT-manager flow: type or paste people, and each one gets a seat and a key right away.
 * No invitation to accept and no account needed; the keys are shown here to copy or export.
 */
export function AddPeopleDialog({
  teamId,
  teamName,
  freeSeats,
  myRole,
  open,
  onOpenChange,
  onRequestSeats,
}: {
  teamId: string;
  teamName: string;
  freeSeats: number;
  myRole: Role;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** Opens "Ask for more seats", suggesting how many more this addition needs. */
  onRequestSeats: (extra: number) => void;
}) {
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[]>([{ id: 0, name: "", email: "" }]);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [assignSeat, setAssignSeat] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<Member[] | null>(null);
  const { people, invalid } = readRows(rows);
  const overLimit = assignSeat && people.length > freeSeats;

  const add = useMutation({
    mutationFn: () => api.addMembers(teamId, { members: people, role, assignSeat, sendEmail }),
    onSuccess: ({ members, skipped }) => {
      qc.invalidateQueries({ queryKey: ["team", teamId] });
      if (skipped.length) toast.info(`Skipped ${skipped.map((s) => s.email).join(", ")}: already on the team.`);
      if (!members.length) return;
      setRows([{ id: Date.now(), name: "", email: "" }]);
      setAdded(members);
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : "Couldn't add them. Try again."),
  });

  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) {
      setAdded(null);
      setError(null);
    }
  };

  if (added) {
    const withKeys = added.filter((m) => m.license?.key);
    const noEmail = withKeys.filter((m) => !m.email).length;
    return (
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Added {added.length} {added.length === 1 ? "person" : "people"}
            </DialogTitle>
            <DialogDescription>
              {withKeys.length
                ? sendEmail && noEmail < withKeys.length
                  ? noEmail
                    ? "Everyone with an email was emailed their key. Copy the keys for the others here and hand them over, or find them on the team page later."
                    : "Each one was emailed their key. You can also copy the keys here, or any time from the team page."
                  : "No email was sent. Hand each person their key, or export them all as CSV."
                : "They're on the team without a seat. Assign one from the members list when they need a key."}
            </DialogDescription>
          </DialogHeader>
          <ul className="divide-border border-border max-h-80 divide-y overflow-y-auto rounded-xl border">
            {added.map((m) => (
              <li key={m.memberId} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{who(m)}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {m.name ? `${m.email ?? "no email"} · ` : ""}
                    {m.license ? `valid until ${formatDate(m.license.expiresAt)}` : "no seat"}
                  </p>
                </div>
                {m.license?.key && (
                  <>
                    <code className="bg-foreground/[0.05] text-muted-foreground hidden rounded-md px-2 py-1 font-mono text-xs sm:block">
                      {maskKey(m.license.key)}
                    </code>
                    <CopyButton
                      value={m.license.key}
                      label="Copy key"
                      toastText={`Key for ${who(m)} copied`}
                      variant="secondary"
                      size="sm"
                    />
                  </>
                )}
              </li>
            ))}
          </ul>
          <DialogFooter>
            {withKeys.length > 0 && (
              <Button
                variant="ghost"
                onClick={() =>
                  downloadText(
                    `motionql-keys-${teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`,
                    keysCsv(withKeys.map((m) => ({ email: m.email, name: m.name, expiresAt: m.license!.expiresAt, key: m.license!.key }))),
                  )
                }
              >
                <Download /> Download CSV
              </Button>
            )}
            <Button onClick={() => close(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add people</DialogTitle>
          <DialogDescription>
            Each person gets a seat and their own MotionQL key right away. They don&apos;t need to accept anything or create an account.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (!people.length) return setError("Enter at least one name or email.");
            if (invalid.size) return setError("Check the highlighted email addresses, or leave them empty.");
            if (overLimit) return setError(`You're adding ${people.length} people but only ${Math.max(0, freeSeats)} seats are free.`);
            add.mutate();
          }}
        >
          <FormError message={error} />
          {overLimit && (
            <p className="border-warning/40 bg-warning/10 rounded-lg border px-3.5 py-2.5 text-sm">
              That&apos;s {people.length - Math.max(0, freeSeats)} more than your free seats.{" "}
              <button
                type="button"
                className="font-medium underline underline-offset-2"
                onClick={() => onRequestSeats(people.length - Math.max(0, freeSeats))}
              >
                Ask for more seats
              </button>
            </p>
          )}
          <div className="grid gap-2">
            <PeopleRows rows={rows} setRows={setRows} invalidIds={invalid} />
            <p className="text-muted-foreground text-xs">
              {people.length
                ? `${people.length} ${people.length === 1 ? "person" : "people"} · ${Math.max(0, freeSeats)} seat${freeSeats === 1 ? "" : "s"} free. `
                : ""}
              Without an email, nothing is sent: you copy their key here and hand it over.{" "}
              {!pasteOpen && (
                <button
                  type="button"
                  className="text-foreground font-medium underline underline-offset-2"
                  onClick={() => setPasteOpen(true)}
                >
                  Paste a list
                </button>
              )}
            </p>
            {pasteOpen && (
              <div className="border-border grid gap-2 rounded-xl border p-3">
                <label htmlFor="paste-people" className="text-sm font-medium">
                  Paste a list
                </label>
                <textarea
                  id="paste-people"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={4}
                  placeholder={"Maya Cohen, maya@acme.io\nJordan Lee\nalex@acme.io"}
                  className="border-input bg-foreground/[0.03] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/25 w-full rounded-lg border px-3.5 py-2.5 font-mono text-[13px] outline-none focus-visible:ring-3"
                />
                <p className="text-muted-foreground text-xs">
                  One person per line: a name, an email, or both. Two columns from a spreadsheet work too.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const parsed = parsePeople(pasteText).people;
                      if (!parsed.length) return;
                      const kept = rows.filter((r) => r.name.trim() || r.email.trim());
                      const base = Date.now();
                      setRows([...kept, ...parsed.map((p, i) => ({ id: base + i, name: p.name ?? "", email: p.email ?? "" }))]);
                      setPasteText("");
                      setPasteOpen(false);
                    }}
                  >
                    <ClipboardPaste /> Add to the list
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setPasteOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          {myRole === "owner" && (
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
                    <input type="radio" name="add-role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                    <span className="font-medium capitalize">{r}</span>
                    <span className="text-muted-foreground mt-0.5 block text-xs">
                      {r === "member" ? "Uses their own key" : "Also manages people and keys once they have an account"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className="grid gap-3">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={assignSeat}
                onChange={(e) => setAssignSeat(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Give each one a seat and a Pro key now
            </label>
            <label className={cn("flex items-center gap-3 text-sm", !assignSeat && "opacity-50")}>
              <input
                type="checkbox"
                checked={sendEmail}
                disabled={!assignSeat}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Email each person their key
              <span className="text-muted-foreground text-xs">(when they have an email; turn off to hand keys out yourself)</span>
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={add.isPending}>
              {add.isPending ? <Loader2 className="animate-spin" /> : assignSeat ? <KeyRound /> : <UserPlus />}
              {assignSeat ? "Add and create keys" : "Add to team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Gives a member's seat to someone else: their key is revoked and the new person gets one. */
export function ReassignDialog({
  teamId,
  from,
  onOpenChange,
}: {
  teamId: string;
  from: Member | null;
  onOpenChange: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Member | null>(null);
  const reassign = useMutation({
    mutationFn: () =>
      api.reassignSeat(teamId, from!.userId ?? from!.memberId, {
        ...(name.trim() ? { name: name.trim() } : {}),
        ...(email.trim() ? { email: email.trim().toLowerCase() } : {}),
        sendEmail,
      }),
    onSuccess: ({ member }) => {
      qc.invalidateQueries({ queryKey: ["team", teamId] });
      setName("");
      setEmail("");
      setResult(member);
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : "Couldn't move the seat. Try again."),
  });
  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) {
      setResult(null);
      setError(null);
    }
  };
  return (
    <Dialog open={!!from} onOpenChange={close}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{result ? "Seat reassigned" : `Give ${from ? who(from) : ""}'s seat to someone else`}</DialogTitle>
          <DialogDescription>
            {result
              ? `${who(result)} has the seat now${sendEmail && result.email ? " and was emailed their key" : ". Copy their key below and hand it over"}.`
              : "Their key stops working within about 4 hours and they stay on the team without a seat. The new person gets their own key."}
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <>
            {result.license?.key && (
              <div className="border-border flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
                <code className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-xs">{maskKey(result.license.key)}</code>
                <CopyButton value={result.license.key} label="Copy key" variant="secondary" size="sm" />
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => close(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              if (!name.trim() && !email.trim()) return setError("Enter a name or an email.");
              if (email.trim() && !EMAIL_OK.test(email.trim())) return setError("That email doesn't look right.");
              reassign.mutate();
            }}
          >
            <FormError message={error} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="reassign-name" label="Name">
                <Input
                  id="reassign-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jordan Lee"
                  autoComplete="off"
                />
              </FormField>
              <FormField id="reassign-email" label="Email (optional)">
                <Input
                  id="reassign-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@acme.io"
                  autoComplete="off"
                />
              </FormField>
            </div>
            <label className={cn("flex items-center gap-3 text-sm", !email.trim() && "opacity-50")}>
              <input
                type="checkbox"
                checked={sendEmail && !!email.trim()}
                disabled={!email.trim()}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Email them their key
            </label>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => close(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={reassign.isPending}>
                {reassign.isPending && <Loader2 className="animate-spin" />}
                Reassign seat
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Name and email of someone without an account. A new email gets them a new key there (same end date); the old key
 * stops working.
 */
export function EditContactDialog({
  teamId,
  member,
  onOpenChange,
}: {
  teamId: string;
  member: Member;
  onOpenChange: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const emailChanged = email.trim().toLowerCase() !== (member.email ?? "");
  const save = useMutation({
    mutationFn: () =>
      api.updateMember(teamId, member.memberId, { name: name.trim(), email: email.trim() ? email.trim().toLowerCase() : null }),
    onSuccess: () => {
      toast.success(
        emailChanged && member.hasSeat
          ? email.trim()
            ? `Saved. ${email.trim().toLowerCase()} was emailed a new key; the old one stops working.`
            : "Saved. They have a new key; copy it from their row and hand it over."
          : "Saved",
      );
      qc.invalidateQueries({ queryKey: ["team", teamId] });
      onOpenChange(false);
    },
    onError: (e) => setError(e instanceof ApiError ? (e.fields?.email ?? e.fields?.name ?? e.message) : "Couldn't save. Try again."),
  });
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{member.email ? "Edit name and email" : "Add an email"}</DialogTitle>
          <DialogDescription>
            {member.hasSeat
              ? "With an email, they get their key by email and it links to their account if they sign up. Changing the email gives them a new key there with the same end date, and the old key stops working."
              : "With an email, their key is emailed to them when they get a seat, and it links to their account if they sign up."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (!name.trim() && !email.trim()) return setError("Enter a name or an email.");
            if (email.trim() && !EMAIL_OK.test(email.trim())) return setError("That email doesn't look right.");
            save.mutate();
          }}
        >
          <FormError message={error} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="contact-name" label="Name">
              <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
            </FormField>
            <FormField id="contact-email" label="Email (optional)">
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="off"
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="animate-spin" />}
              {emailChanged && member.hasSeat && email.trim() ? "Save and send new key" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
