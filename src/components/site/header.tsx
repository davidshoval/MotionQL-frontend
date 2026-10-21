"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MegaMenu, MobileMenu } from "./mega-menu";
import { useMe } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: me } = useMe();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div
        className={cn(
          "container-page flex h-14 items-center justify-between rounded-full border transition-all duration-300",
          scrolled || open || menuOpen
            ? "border-border bg-background/70 max-w-6xl shadow-[0_8px_40px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl"
            : "border-transparent",
        )}
      >
        <Link href="/" aria-label="MotionQL home" className="shrink-0 pl-1">
          <Logo />
        </Link>

        <MegaMenu pathname={pathname} onOpenChange={setMenuOpen} />

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {me ? (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/account">Account</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={me ? "/download" : "/register"}>
              {me ? "Download" : "Get MotionQL free"}
              <ArrowRight />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="container-page border-border bg-background/95 mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border p-3 shadow-2xl backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            <MobileMenu />
            <div className="border-border mt-2 grid grid-cols-2 gap-2 border-t pt-3">
              <Button asChild variant="secondary">
                <Link href={me ? "/account" : "/login"}>{me ? "Account" : "Sign in"}</Link>
              </Button>
              <Button asChild>
                <Link href={me ? "/download" : "/register"}>{me ? "Download" : "Get started"}</Link>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
