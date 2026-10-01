"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { resetSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { FormError, FormField } from "@/components/app/form-field";
import { PasswordInput } from "@/components/app/password-input";

export function ResetForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema) });

  if (!token)
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold">This reset link is incomplete</h1>
        <Link href="/forgot-password" className="text-primary mt-4 inline-block hover:underline">
          Request a new one
        </Link>
      </div>
    );

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={handleSubmit(async ({ password }) => {
          setError(null);
          try {
            await api.confirmPasswordReset(token, password);
            toast.success("Password changed. Sign in with your new password.");
            router.push("/login");
          } catch (e) {
            setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
          }
        })}
      >
        <FormError message={error} />
        <FormField id="password" label="New password" error={errors.password?.message} hint="At least 10 characters.">
          <PasswordInput id="password" autoComplete="new-password" {...register("password")} />
        </FormField>
        <FormField id="confirm" label="Confirm password" error={errors.confirm?.message}>
          <PasswordInput id="confirm" autoComplete="new-password" {...register("confirm")} />
        </FormField>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Save password
        </Button>
      </form>
    </div>
  );
}
