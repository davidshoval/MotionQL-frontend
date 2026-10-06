import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = pageMetadata({
  title: "Create your free account",
  description: "Sign up for MotionQL and get a free Pro license for 12 months. Download the MongoDB GUI for macOS, Windows and Linux.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
