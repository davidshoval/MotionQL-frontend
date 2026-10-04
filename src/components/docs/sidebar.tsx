"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DocSection } from "@/lib/docs";
import { cn } from "@/lib/utils";

function NavList({ sections, pathname }: { sections: DocSection[]; pathname: string }) {
  return (
    <nav aria-label="Documentation" className="space-y-7">
      <Link
        href="/docs"
        className={cn(
          "block text-sm transition-colors",
          pathname === "/docs" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Overview
      </Link>
      {sections.map((s) => (
        <div key={s.title}>
          <h2 className="text-foreground mb-2 font-mono text-[11px] tracking-[0.14em] uppercase">{s.title}</h2>
          <ul className="border-border space-y-0.5 border-l">
            {s.pages.map((p) => {
              const href = `/docs/${p.slug}`;
              const active = pathname === href;
              return (
                <li key={p.slug}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "-ml-px block border-l py-1.5 pl-4 text-sm transition-colors",
                      active
                        ? "border-primary text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:border-foreground/30 border-transparent",
                    )}
                  >
                    {p.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar({ sections }: { sections: DocSection[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);
  const current = sections.flatMap((s) => s.pages).find((p) => pathname === `/docs/${p.slug}`);

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="border-border bg-card/50 flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm"
        >
          <span>{current?.title ?? "Overview"}</span>
          <ChevronDown className={cn("text-muted-foreground size-4 transition", open && "rotate-180")} />
        </button>
        {open && (
          <div className="border-border bg-card/50 mt-2 rounded-xl border p-4">
            <NavList sections={sections} pathname={pathname} />
          </div>
        )}
      </div>
      <div className="hidden lg:block">
        <NavList sections={sections} pathname={pathname} />
      </div>
    </>
  );
}
