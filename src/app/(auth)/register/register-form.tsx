"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { registerSchema, safeNext, type RegisterValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError, FormField } from "@/components/app/form-field";
import { PasswordInput } from "@/components/app/password-input";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: params.get("email") ?? "" },
  });

  async function onSubmit(v: RegisterValues) {
    setError(null);
    try {
      const res = await api.register({ name: v.name, email: v.email, password: v.password, company: v.company || undefined });
      if (res.devVerifyToken) sessionStorage.setItem("xq-dev-verify", res.devVerifyToken);
      sessionStorage.setItem("xq-next", next);
      router.push(`/verify-email?email=${encodeURIComponent(v.email)}`);
    } catch (e) {
      if (e instanceof ApiError) {
        for (const [k, m] of Object.entries(e.fields ?? {})) setFieldError(k as keyof RegisterValues, { message: m });
        if (!e.fields) setError(e.message);
      } else setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground mt-2">Free forever, with a Pro license for your first year.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
        <FormError message={error} />
        <FormField id="name" label="Full name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField id="email" label="Work email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
        <FormField id="company" label="Company (optional)" error={errors.company?.message}>
          <Input id="company" autoComplete="organization" {...register("company")} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password?.message} hint="At least 10 characters.">
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
        </FormField>
        <label className="text-muted-foreground flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 accent-[var(--primary)]" {...register("terms")} />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="text-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            ,{" "}
            <Link href="/legal/eula" className="text-foreground underline-offset-4 hover:underline">
              EULA
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-foreground underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.terms && <p className="text-destructive -mt-2 text-[13px]">{errors.terms.message}</p>}
        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
          {isSubmitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link
          href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-foreground font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
