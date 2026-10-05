import { z } from "zod";

export const email = z.string().trim().min(1, "Enter your email").email("Enter a valid email address");
export const password = z.string().min(10, "Use at least 10 characters").max(200, "That's too long");

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Enter your name").max(100),
    email,
    company: z.string().trim().max(120).optional(),
    password,
    terms: z.literal(true, { message: "Please accept the terms to continue" }),
    usage: z.enum(["solo", "team"]),
    teamName: z.string().trim().max(80).optional(),
  })
  .refine((v) => v.usage !== "team" || !!v.teamName, {
    path: ["teamName"],
    message: "Name your team",
    // Show this together with the other field errors instead of only after they're fixed.
    when: (ctx) => (ctx.value as { usage?: string })?.usage === "team",
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password") });
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotSchema = z.object({ email });
export const resetSchema = z
  .object({ password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

/** Only follow same-site relative redirects. */
export function safeNext(next: string | null | undefined, fallback = "/account") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
