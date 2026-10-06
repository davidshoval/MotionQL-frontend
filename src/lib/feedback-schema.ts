import { z } from "zod";

export const feedbackSchema = z.object({
  kind: z.enum(["bug", "idea", "praise", "other"]),
  message: z.string().trim().min(3, "Write a few words").max(5000, "Keep it under 5000 characters"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address")]).optional(),
  website: z.string().optional(),
});
export type FeedbackValues = z.infer<typeof feedbackSchema>;
