import { http, USE_MOCK } from "./client";

export type FeedbackKind = "bug" | "idea" | "praise" | "other";

export interface FeedbackInput {
  kind: FeedbackKind;
  message: string;
  email?: string;
  /** The page the form was opened from, e.g. /pricing. */
  page?: string;
  /** Hidden field people never see; bots fill it in and the server drops the message. */
  website?: string;
}

/** POST /feedback (docs/API.md in motionql-backend): stored and e-mailed to the team. */
export async function sendFeedback(input: FeedbackInput): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    console.info("[mock api] feedback", input);
    return;
  }
  await http<void>("POST", "/feedback", input);
}
