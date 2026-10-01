import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Aurora } from "@/components/marketing/aurora";

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center px-6 text-center">
      <Aurora className="-z-10 opacity-60" />
      <div>
        <p className="text-primary font-mono text-sm">db.pages.findOne(&#123; path &#125;) → null</p>
        <h1 className="text-gradient mt-4 text-6xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground mt-4">This page doesn&apos;t exist, or it moved.</p>
        <Button asChild className="mt-8">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
