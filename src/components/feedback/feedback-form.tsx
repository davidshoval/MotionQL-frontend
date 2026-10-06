"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bug, CheckCircle2, Heart, Lightbulb, Loader2, MessageCircle, Send } from "lucide-react";
import { ApiError } from "@/lib/api";
import { sendFeedback, type FeedbackKind } from "@/lib/api/feedback";
import { useMe } from "@/lib/api/hooks";
import { feedbackSchema, type FeedbackValues } from "@/lib/feedback-schema";
import { safeNext } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormField } from "@/components/app/form-field";
import { cn } from "@/lib/utils";

const kinds: { id: FeedbackKind; label: string; icon: typeof Bug; placeholder: string }[] = [
  { id: "bug", label: "Bug", icon: Bug, placeholder: "What did you do, what did you expect, and what happened instead?" },
  { id: "idea", label: "Idea", icon: Lightbulb, placeholder: "What would you like MotionQL to do, and what would it help you with?" },
  { id: "praise", label: "Praise", icon: Heart, placeholder: "What do you like? It helps us know what to keep." },
  { id: "other", label: "Other", icon: MessageCircle, placeholder: "Tell us anything." },
];

const isKind = (v: string | null): v is FeedbackKind => kinds.some((k) => k.id === v);

export function FeedbackForm() {
  const params = useSearchParams();
  const initialKind = params.get("kind");
  // Where the visitor came from, so the team knows which page a remark is about.
  const from = params.get("from");
  const page = from ? safeNext(from, "") || undefined : undefined;
  const me = useMe();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError: setFieldError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { kind: isKind(initialKind) ? initialKind : "idea", message: "", email: "", website: "" },
  });
  const kind = useWatch({ control, name: "kind" });
  const signedInEmail = me.data?.user.email;

  useEffect(() => {
    if (signedInEmail && !getValues("email")) setValue("email", signedInEmail);
  }, [signedInEmail, getValues, setValue]);

  async function onSubmit(v: FeedbackValues) {
    setError(null);
    try {
      await sendFeedback({ kind: v.kind, message: v.message, email: v.email || undefined, page, website: v.website || undefined });
      setSent(true);
    } catch (e) {
      if (e instanceof ApiError) {
        for (const [k, m] of Object.entries(e.fields ?? {})) setFieldError(k as keyof FeedbackValues, { message: m });
        if (!e.fields) setError(e.message);
      } else setError("Something went wrong. Please try again.");
    }
  }

  if (sent)
    return (
      <div className="border-border bg-card/50 flex flex-col items-center gap-4 rounded-2xl border p-10 text-center">
        <span className="bg-primary/12 text-primary grid size-12 place-items-center rounded-full">
          <CheckCircle2 className="size-6" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Thanks, we got it</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            A person on the team reads every message.
            {getValues("email") ? " If we have a question, we'll write to you." : ""}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              reset({ kind, message: "", email: getValues("email"), website: "" });
              setSent(false);
            }}
          >
            Send more feedback
          </Button>
          <Button asChild variant="ghost">
            <Link href="/roadmap">See the roadmap</Link>
          </Button>
        </div>
      </div>
    );

  const active = kinds.find((k) => k.id === kind) ?? kinds[1]!;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="border-border bg-card/50 grid gap-5 rounded-2xl border p-6 sm:p-8">
      <FormError message={error} />
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">What kind of feedback?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup">
          {kinds.map((k) => (
            <button
              key={k.id}
              type="button"
              role="radio"
              aria-checked={kind === k.id}
              onClick={() => setValue("kind", k.id)}
              className={cn(
                "border-border hover:border-primary/50 focus-visible:ring-ring/30 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition outline-none focus-visible:ring-3",
                kind === k.id ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <k.icon className="size-4" /> {k.label}
            </button>
          ))}
        </div>
      </fieldset>
      <FormField id="message" label="Your message" error={errors.message?.message}>
        <Textarea id="message" rows={7} placeholder={active.placeholder} aria-invalid={!!errors.message} {...register("message")} />
      </FormField>
      <FormField
        id="email"
        label="Email (optional)"
        error={errors.email?.message}
        hint="Only if you'd like a reply. We never add it to a mailing list."
      >
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </FormField>
      {/* Hidden from people; bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <p className="text-muted-foreground text-[13px]">
        Please don&apos;t include passwords, connection strings, license keys or customer data.
      </p>
      <Button type="submit" size="lg" disabled={isSubmitting} className="justify-self-start">
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />} Send feedback
      </Button>
    </form>
  );
}
