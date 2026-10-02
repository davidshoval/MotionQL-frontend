"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useMe } from "@/lib/api/hooks";
import { USE_MOCK } from "@/lib/api";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { UserMenu } from "@/components/app/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading, isError, refetch } = useMe();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isError && me === null) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isLoading, isError, me, router, pathname]);

  const links = [
    { href: "/account", label: "Account" },
    ...(me?.teams.map((t) => ({ href: `/team/${t.id}`, label: t.name })) ?? []),
    { href: "/download", label: "Download" },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border bg-background/75 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="container-page flex h-16 items-center gap-6">
          <Link href="/" aria-label="MotionQL home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Account">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground max-w-48 truncate rounded-full px-3 py-1.5 text-sm transition-colors",
                  pathname.startsWith(l.href) && "bg-foreground/[0.06] text-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {USE_MOCK && (
              <span className="border-warning/30 bg-warning/10 text-warning hidden rounded-full border px-2.5 py-0.5 text-xs md:inline">
                Preview data
              </span>
            )}
            <ThemeToggle />
            {me && <UserMenu user={me.user} teams={me.teams} />}
          </div>
        </div>
      </header>
      <main className="container-page flex-1 py-10">
        {isError ? (
          <div className="mx-auto max-w-md py-24 text-center">
            <p className="text-lg font-medium">We couldn&apos;t reach your account.</p>
            <p className="text-muted-foreground mt-2">Check your connection and try again.</p>
            <Button className="mt-6" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : me ? (
          children
        ) : (
          <div className="grid place-items-center py-32">
            <Loader2 className="text-muted-foreground size-6 animate-spin" />
          </div>
        )}
      </main>
    </div>
  );
}
