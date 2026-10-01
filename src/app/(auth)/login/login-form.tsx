"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { qk } from "@/lib/api/hooks";
import { loginSchema, safeNext, type LoginValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError, FormField } from "@/components/app/form-field";
import { PasswordInput } from "@/components/app/password-input";
import { OAuthButtons } from "@/components/app/oauth-buttons";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();
  const next = safeNext(params.get("next"));
  const [error, setError] = useState<{ message: string; unverified?: boolean } | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(v: LoginValues) {
    setError(null);
    try {
      await api.login(v.email, v.password);
      await qc.invalidateQueries({ queryKey: qk.me });
      router.push(next);
    } catch (e) {
      if (e instanceof ApiError) setError({ message: e.message, unverified: e.code === "email_not_verified" });
      else setError({ message: "Something went wrong. Please try again." });
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Sign in to get your key and downloads.</p>
      </div>
      <OAuthButtons next={next} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
        <FormError message={error?.message} />
        {error?.unverified && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/verify-email?email=${encodeURIComponent(getValues("email"))}`)}
          >
            Resend the verification email
          </Button>
        )}
        <FormField id="email" label="Email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
          action={
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground text-[13px]">
              Forgot password?
            </Link>
          }
        >
          <PasswordInput id="password" autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} />
        </FormField>
        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
          {isSubmitting && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
      <p className="text-muted-foreground text-center text-sm">
        New to XQuery?{" "}
        <Link
          href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-foreground font-medium hover:underline"
        >
          Create a free account
        </Link>
      </p>
    </div>
  );
}
