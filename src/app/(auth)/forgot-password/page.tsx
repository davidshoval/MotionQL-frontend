"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, MailCheck } from "lucide-react";
import { api, USE_MOCK } from "@/lib/api";
import { forgotSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/app/form-field";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState<{ email: string; devToken?: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof forgotSchema>>({ resolver: zodResolver(forgotSchema) });

  if (sent)
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <MailCheck className="text-primary size-12" />
        <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground">If an account exists for {sent.email}, a reset link is on its way.</p>
        {sent.devToken && (
          <Button asChild>
            <Link href={`/reset-password?token=${encodeURIComponent(sent.devToken)}`}>Open the reset link (preview)</Link>
          </Button>
        )}
        <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm">
          Back to sign in
        </Link>
      </div>
    );

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-muted-foreground mt-2">Enter your email and we&apos;ll send you a link.</p>
      </div>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={handleSubmit(async ({ email }) => {
          // Always show the same answer, so this form can't be used to find out who has an account.
          const res = await api.requestPasswordReset(email).catch(() => undefined);
          setSent({ email, devToken: USE_MOCK && res ? res.devResetToken : undefined });
        })}
      >
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Send reset link
        </Button>
      </form>
      <Link href="/login" className="text-muted-foreground hover:text-foreground text-center text-sm">
        Back to sign in
      </Link>
    </div>
  );
}
