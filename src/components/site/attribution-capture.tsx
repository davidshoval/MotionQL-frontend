"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/attribution";

/** Remembers where this visit started (utm_* tags, landing path, referring host) for sign-up. Renders nothing. */
export function AttributionCapture() {
  useEffect(() => captureFirstTouch(), []);
  return null;
}
