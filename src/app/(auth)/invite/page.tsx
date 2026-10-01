import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptInvite } from "./accept-invite";

export const metadata: Metadata = { title: "Join your team" };

export default function InvitePage() {
  return (
    <Suspense>
      <AcceptInvite />
    </Suspense>
  );
}
