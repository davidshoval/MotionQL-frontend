"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, User, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { registerSchema, safeNext, type RegisterValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError, FormField } from "@/components/app/form-field";
import { PasswordInput } from "@/components/app/password-input";
import { savePendingTeam } from "@/lib/pending-team";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [error, setError] = useState<string | null>(null);
  // People who arrive from a team invite are joining a team, not starting one.
  const joining = next.startsWith("/invite");
  const [usage, setUsage] = useState<"solo" | "team" | null>(joining ? "solo" : null);
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: params.get("email") ?? "", usage: usage ?? undefined },
  });

  async function onSubmit(v: RegisterValues) {
    setError(null);
    try {
      const company = (v.usage === "team" ? v.teamName : v.company) || undefined;
      const res = await api.register({ name: v.name, email: v.email, password: v.password, company });
      if (res.devVerifyToken) sessionStorage.setItem("mq-dev-verify", res.devVerifyToken);
      if (v.usage === "team" && v.teamName) savePendingTeam(v.email, v.teamName);
      sessionStorage.setItem("mq-next", next);
      router.push(`/verify-email?email=${encodeURIComponent(v.email)}`);
    } catch (e) {
      if (e instanceof ApiError) {
        for (const [k, m] of Object.entries(e.fields ?? {})) setFieldError(k as keyof RegisterValues, { message: m });
        if (!e.fields) setError(e.message);
      } else setError("Something went wrong. Please try again.");
    }
  }

  if (!usage)
    return (
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">How will you use MotionQL?</h1>
          <p className="text-muted-foreground mt-2">Both are free. You can create or join a team later either way.</p>
        </div>
        <div className="grid gap-3">
          {(
            [
              { id: "solo", icon: User, title: "Just me", text: "A personal Pro license, free for your first year." },
              {
                id: "team",
                icon: Users,
                title: "For my team",
                text: "You manage the team: invite people, hand out seats and keys, and see who uses the app.",
              },
            ] as const
          ).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setUsage(o.id);
                setValue("usage", o.id);
              }}
              className="group border-border hover:border-primary/50 hover:bg-primary/[0.04] focus-visible:ring-ring/30 flex items-start gap-4 rounded-2xl border p-5 text-left transition outline-none focus-visible:ring-3"
            >
              <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-xl">
                <o.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{o.title}</span>
                <span className="text-muted-foreground mt-1 block text-sm">{o.text}</span>
              </span>
              <ArrowRight className="text-muted-foreground group-hover:text-primary mt-3 size-4 shrink-0 transition" />
            </button>
          ))}
        </div>
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );

  return (
    <div className="grid gap-6">
      <div>
        {!joining && (
          <button
            type="button"
            onClick={() => setUsage(null)}
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" /> {usage === "team" ? "For my team" : "Just me"}
          </button>
        )}
        <h1 className="text-3xl font-semibold tracking-tight">{usage === "team" ? "Create your team account" : "Create your account"}</h1>
        <p className="text-muted-foreground mt-2">
          {usage === "team"
            ? "You'll be the team's manager. Invite your teammates right after you confirm your email."
            : "Free forever, with a Pro license for your first year."}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
        <FormError message={error} />
        {usage === "team" && (
          <FormField id="teamName" label="Team or company name" error={errors.teamName?.message}>
            <Input
              id="teamName"
              autoComplete="organization"
              placeholder="Acme Data"
              aria-invalid={!!errors.teamName}
              {...register("teamName")}
            />
          </FormField>
        )}
        <FormField id="name" label="Full name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </FormField>
        <FormField id="email" label="Work email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </FormField>
        {usage === "solo" && (
          <FormField id="company" label="Company (optional)" error={errors.company?.message}>
            <Input id="company" autoComplete="organization" {...register("company")} />
          </FormField>
        )}
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
          {usage === "team" ? "Create account and team" : "Create account"}
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
