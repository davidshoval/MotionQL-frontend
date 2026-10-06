import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = privateMetadata("Sign in");

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
