"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { qk, useMe } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/app/form-field";
import { toast } from "sonner";

export function AcceptInvite() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me, isLoading } = useMe();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const here = `/invite?token=${encodeURIComponent(token)}`;
  const preview = useQuery({ queryKey: ["invite-preview", token], queryFn: () => api.previewInvite(token), enabled: !!token, retry: false });
  const inv = preview.data;
  const wrongAccount = !!(inv && me && inv.email.toLowerCase() !== me.user.email.toLowerCase());

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      const { team, seatAssigned } = await api.acceptInvite(token);
      await qc.invalidateQueries({ queryKey: qk.me });
      toast.success(
        seatAssigned ? `You joined ${team.name}. Your Pro key is on your account page.` : `You joined ${team.name}. An admin will assign your seat.`,
      );
      router.push(`/team/${team.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "We couldn't accept this invitation.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span className="border-border bg-primary/10 text-primary grid size-16 place-items-center rounded-3xl border">
        <Users className="size-8" />
      </span>
      <h1 className="text-3xl font-semibold tracking-tight">{inv ? `Join ${inv.teamName}` : "You're invited"}</h1>
      <p className="text-muted-foreground">
        {inv
          ? `${inv.invitedBy} invited ${inv.email} to join as ${inv.role === "admin" ? "an admin" : "a member"}${inv.assignSeat ? ", with a Pro seat" : ""}.`
          : "Join your team on XQuery to get your own Pro key, managed by your team admin."}
      </p>
      <FormError
        message={
          error ??
          (!token
            ? "This link is missing its invitation code. Open the link from the e-mail again."
            : preview.isError
              ? preview.error instanceof ApiError
                ? preview.error.message
                : "This invitation is no longer valid."
              : wrongAccount
                ? `This invitation is for ${inv!.email}. Sign out and sign in with that e-mail to accept it.`
                : null)
        }
      />
      {isLoading || preview.isLoading ? (
        <Loader2 className="text-muted-foreground animate-spin" />
      ) : me ? (
        <Button size="lg" onClick={accept} disabled={busy || !inv || wrongAccount}>
          {busy && <Loader2 className="animate-spin" />}
          Accept as {me.user.email}
        </Button>
      ) : (
        <div className="grid w-full gap-2">
          <Button asChild size="lg">
            <Link href={`/register?next=${encodeURIComponent(here)}`}>Create an account to join</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/login?next=${encodeURIComponent(here)}`}>I already have an account</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
