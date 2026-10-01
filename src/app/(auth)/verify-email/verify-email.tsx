"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MailCheck, XCircle } from "lucide-react";
import { api, ApiError, USE_MOCK } from "@/lib/api";
import { qk } from "@/lib/api/hooks";
import { safeNext } from "@/lib/schemas";
import { Button } from "@/components/ui/button";

export function VerifyEmail() {
  const params = useSearchParams();
  const token = params.get("token");
  return token ? <Confirm token={token} /> : <CheckInbox email={params.get("email") ?? ""} />;
}

function Confirm({ token }: { token: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [state, setState] = useState<"working" | "done" | { error: string }>("working");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    api
      .verifyEmail(token)
      .then(async () => {
        await qc.invalidateQueries({ queryKey: qk.me });
        setState("done");
        const next = safeNext(sessionStorage.getItem("xq-next"));
        sessionStorage.removeItem("xq-next");
        sessionStorage.removeItem("xq-dev-verify");
        setTimeout(() => router.push(next), 1400);
      })
      .catch((e) => setState({ error: e instanceof ApiError ? e.message : "We couldn't verify this link." }));
  }, [token, qc, router]);

  if (state === "working")
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="text-primary size-10 animate-spin" />
        <h1 className="text-2xl font-semibold">Verifying your email…</h1>
      </div>
    );
  if (state === "done")
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="text-primary size-12" />
        <h1 className="text-3xl font-semibold tracking-tight">You&apos;re in</h1>
        <p className="text-muted-foreground">Your free Pro key is ready. Taking you to your account…</p>
      </div>
    );
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <XCircle className="text-destructive size-12" />
      <h1 className="text-2xl font-semibold">This link didn&apos;t work</h1>
      <p className="text-muted-foreground">{state.error}</p>
      <Button asChild variant="secondary">
        <Link href="/login">Sign in to get a new link</Link>
      </Button>
    </div>
  );
}

function CheckInbox({ email }: { email: string }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- read the preview token stored by the register form
  useEffect(() => setDevToken(USE_MOCK ? sessionStorage.getItem("xq-dev-verify") : null), []);

  async function resend() {
    setSending(true);
    try {
      await api.resendVerification(email);
      toast.success("Sent. Check your inbox (and spam folder).");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Couldn't send. Try again in a minute.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <span className="border-border bg-primary/10 text-primary grid size-16 place-items-center rounded-3xl border">
        <MailCheck className="size-8" />
      </span>
      <h1 className="text-3xl font-semibold tracking-tight">Check your inbox</h1>
      <p className="text-muted-foreground">
        We sent a verification link to {email ? <span className="text-foreground font-medium">{email}</span> : "your email"}. Click it and
        your free Pro key will be waiting on your account page.
      </p>
      {devToken && (
        <Button onClick={() => router.push(`/verify-email?token=${encodeURIComponent(devToken)}`)}>
          Open the verification link (preview)
        </Button>
      )}
      {email && (
        <Button variant="ghost" size="sm" disabled={sending} onClick={resend}>
          {sending && <Loader2 className="animate-spin" />}
          Didn&apos;t get it? Resend
        </Button>
      )}
    </div>
  );
}
