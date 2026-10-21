"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, KeyRound, Loader2, UserPlus } from "lucide-react";
import { api, ApiError, type Member, type Role } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/app/copy-button";
import { FormError, FormField } from "@/components/app/form-field";
import { downloadText, keysCsv, maskKey, parsePeople } from "./license-utils";

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
}: {
  teamId: string;
  teamName: string;
  freeSeats: number;
  myRole: Role;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [assignSeat, setAssignSeat] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<Member[] | null>(null);
  const { people, invalid } = parsePeople(text);
  const overLimit = assignSeat && people.length > freeSeats;

  const add = useMutation({
    mutationFn: () => api.addMembers(teamId, { members: people, role, assignSeat, sendEmail }),
    onSuccess: ({ members, skipped }) => {
      qc.invalidateQueries({ queryKey: ["team", teamId] });
      if (skipped.length) toast.info(`Skipped ${skipped.map((s) => s.email).join(", ")}: already on the team.`);
      if (!members.length) return;
      setText("");
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
    return (
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Added {added.length} {added.length === 1 ? "person" : "people"}
            </DialogTitle>
            <DialogDescription>
              {withKeys.length
                ? sendEmail
                  ? "Each one was emailed their key. You can also copy the keys here, or any time from the team page."
                  : "No email was sent. Hand each person their key, or export them all as CSV."
                : "They're on the team without a seat. Assign one from the members list when they need a key."}
            </DialogDescription>
          </DialogHeader>
          <ul className="divide-border border-border max-h-80 divide-y overflow-y-auto rounded-xl border">
            {added.map((m) => (
              <li key={m.memberId} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.name || m.email}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {m.name ? `${m.email} · ` : ""}
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
                      toastText={`Key for ${m.email} copied`}
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
      <DialogContent className="max-w-xl">
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
            if (!people.length) return setError("Add at least one email.");
            if (invalid.length) return setError(`These lines have no email: ${invalid.join(", ")}`);
            if (overLimit) return setError(`You're adding ${people.length} people but only ${Math.max(0, freeSeats)} seats are free.`);
            add.mutate();
          }}
        >
          <FormError message={error} />
          <FormField
            id="add-people"
            label="People"
            hint={
              people.length
                ? `${people.length} ${people.length === 1 ? "person" : "people"} · ${Math.max(0, freeSeats)} seat${freeSeats === 1 ? "" : "s"} free`
                : "One per line: an email, or a name and email. You can paste two columns from a spreadsheet."
            }
          >
            <textarea
              id="add-people"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder={"Maya Cohen <maya@acme.io>\njordan@acme.io"}
              className={cn(
                "border-input bg-foreground/[0.03] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/25 w-full rounded-lg border px-3.5 py-2.5 font-mono text-[14px] outline-none focus-visible:ring-3",
                overLimit && "border-warning",
              )}
            />
          </FormField>
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
              <span className="text-muted-foreground text-xs">(turn off to hand keys out yourself)</span>
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
  const [text, setText] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Member | null>(null);
  const parsed = parsePeople(text);
  const reassign = useMutation({
    mutationFn: () => api.reassignSeat(teamId, from!.userId ?? from!.memberId, { ...parsed.people[0], sendEmail }),
    onSuccess: ({ member }) => {
      qc.invalidateQueries({ queryKey: ["team", teamId] });
      setText("");
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
          <DialogTitle>{result ? "Seat reassigned" : `Give ${from?.email}'s seat to someone else`}</DialogTitle>
          <DialogDescription>
            {result
              ? `${result.email} has the seat now${sendEmail ? " and was emailed their key" : ""}.`
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
              if (parsed.people.length !== 1 || parsed.invalid.length) return setError("Enter one email, optionally with a name.");
              reassign.mutate();
            }}
          >
            <FormError message={error} />
            <FormField id="reassign-to" label="New person" hint="An email, or a name and email.">
              <input
                id="reassign-to"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Jordan Lee <jordan@acme.io>"
                autoComplete="off"
                className="border-input bg-foreground/[0.03] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/25 h-10 w-full rounded-lg border px-3.5 text-[15px] outline-none focus-visible:ring-3"
              />
            </FormField>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={sendEmail}
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
