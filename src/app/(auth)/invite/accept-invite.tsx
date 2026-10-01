"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { qk, useMe } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/app/form-field";

export function AcceptInvite() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me, isLoading } = useMe();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const here = `/invite?token=${encodeURIComponent(token)}`;

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      const { team } = await api.acceptInvite(token);
      await qc.invalidateQueries({ queryKey: qk.me });
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
      <h1 className="text-3xl font-semibold tracking-tight">You&apos;re invited</h1>
      <p className="text-muted-foreground">Join your team on XQuery to get your own Pro key, managed by your team admin.</p>
      <FormError message={error} />
      {isLoading ? (
        <Loader2 className="text-muted-foreground animate-spin" />
      ) : me ? (
        <Button size="lg" onClick={accept} disabled={busy || !token}>
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
