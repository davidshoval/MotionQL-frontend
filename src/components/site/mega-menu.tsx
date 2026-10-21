"use client";

import Link from "next/link";
import { NavigationMenu as N } from "radix-ui";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { megaMenu, menuLinks, type MenuLink, type MenuSection } from "@/lib/mega-menu";
import { cn } from "@/lib/utils";

function isActive(pathname: string, s: MenuSection) {
  return (
    s.columns.some((c) => c.links.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))) || pathname.startsWith(s.href)
  );
}

const triggerClass =
  "text-muted-foreground hover:text-foreground data-[state=open]:text-foreground data-[state=open]:bg-foreground/[0.06] inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm xl:px-3.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ItemLink({ link, dense }: { link: MenuLink; dense?: boolean }) {
  const Icon = link.icon;
  return (
    <N.Link asChild>
      <Link
        href={link.href}
        className={cn(
          "group/item hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] flex items-start gap-3 rounded-xl transition-colors outline-none",
          dense ? "px-2.5 py-1.5" : "p-2.5",
        )}
      >
        {Icon && (
          <span className="border-border bg-background text-muted-foreground group-hover/item:text-primary group-hover/item:border-primary/30 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors">
            <Icon className="size-4" />
          </span>
        )}
        <span className="min-w-0">
          <span className="text-foreground block text-sm font-medium">{link.label}</span>
          {link.blurb && <span className="text-muted-foreground mt-0.5 block text-[13px] leading-snug">{link.blurb}</span>}
        </span>
      </Link>
    </N.Link>
  );
}

function Panel({ section }: { section: MenuSection }) {
  const dense = section.columns.every((c) => c.links.every((l) => !l.blurb));
  const f = section.featured;
  return (
    <div className="w-[min(68rem,calc(100vw-1.5rem))] max-w-full">
      <div className={cn("grid gap-6 p-5", f ? "lg:grid-cols-[1fr_18rem]" : "")}>
        <div
          className={cn(
            "grid gap-x-4 gap-y-6",
            `sm:grid-cols-2`,
            section.columns.length >= 3 && "lg:grid-cols-3",
            section.columns.length >= 4 && "lg:grid-cols-4",
          )}
        >
          {section.columns.map((c) => (
            <div key={c.title}>
              <p className="text-muted-foreground/80 px-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase">{c.title}</p>
              <ul className="mt-2 space-y-0.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <ItemLink link={l} dense={dense} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {f && (
          <N.Link asChild>
            <Link
              href={f.href}
              className="group/feat border-primary/20 from-primary/15 via-primary/5 hover:border-primary/40 relative hidden flex-col overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent p-5 transition-colors lg:flex"
            >
              <span className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-xl">
                <f.icon className="size-5" />
              </span>
              <span className="text-primary mt-5 text-[11px] font-semibold tracking-[0.08em] uppercase">{f.eyebrow}</span>
              <span className="text-foreground mt-1.5 text-lg leading-snug font-semibold tracking-tight">{f.title}</span>
              <span className="text-muted-foreground mt-2 text-[13px] leading-relaxed">{f.body}</span>
              <span className="text-primary mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium">
                {f.cta} <ArrowRight className="size-4 transition-transform group-hover/feat:translate-x-0.5" />
              </span>
            </Link>
          </N.Link>
        )}
      </div>
      <div className="border-border bg-foreground/[0.02] flex flex-wrap items-center justify-between gap-3 border-t px-7 py-3.5 text-sm">
        <N.Link asChild>
          <Link
            href={section.href}
            className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium transition-colors"
          >
            {section.footer} <ArrowRight className="size-4" />
          </Link>
        </N.Link>
        <span className="text-muted-foreground text-[13px]">
          Free for commercial work. Pro free for 12 months.{" "}
          <N.Link asChild>
            <Link href="/download" className="text-primary hover:underline">
              Download
            </Link>
          </N.Link>
        </span>
      </div>
    </div>
  );
}

/** Desktop mega menu. The panel opens under the whole header bar, not under its trigger. */
export function MegaMenu({ pathname, onOpenChange }: { pathname: string; onOpenChange?: (open: boolean) => void }) {
  return (
    <N.Root className="hidden lg:block" aria-label="Main" delayDuration={120} onValueChange={(v) => onOpenChange?.(v !== "")}>
      <N.List className="flex items-center gap-0.5">
        {megaMenu.map((s) => (
          <N.Item key={s.label} value={s.label}>
            <N.Trigger className={cn(triggerClass, isActive(pathname, s) && "text-foreground")}>
              {s.label}
              <ChevronDown aria-hidden className="size-3.5 opacity-60 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
            </N.Trigger>
            <N.Content className="data-[motion=from-end]:animate-in data-[motion=from-start]:animate-in data-[motion=to-end]:animate-out data-[motion=to-start]:animate-out data-[motion=from-end]:fade-in data-[motion=from-start]:fade-in data-[motion=to-end]:fade-out data-[motion=to-start]:fade-out">
              <Panel section={s} />
            </N.Content>
          </N.Item>
        ))}
        {menuLinks.map((l) => (
          <N.Item key={l.href}>
            <N.Link asChild active={pathname.startsWith(l.href)}>
              <Link href={l.href} className={cn(triggerClass, pathname.startsWith(l.href) && "bg-foreground/[0.06] text-foreground")}>
                {l.label}
              </Link>
            </N.Link>
          </N.Item>
        ))}
      </N.List>
      <div className="pointer-events-none absolute inset-x-0 top-full flex justify-center px-3 pt-2">
        <N.Viewport className="border-border bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-[0.98] pointer-events-auto relative h-[var(--radix-navigation-menu-viewport-height)] w-[min(68rem,calc(100vw-1.5rem))] origin-top overflow-hidden rounded-3xl border shadow-[0_24px_80px_-24px_rgb(0_0_0/0.45)] backdrop-blur-xl transition-[height] duration-200" />
      </div>
    </N.Root>
  );
}

/** Mobile version: one expandable section per menu. */
export function MobileMenu() {
  return (
    <>
      <Accordion type="single" collapsible>
        {megaMenu.map((s) => (
          <AccordionItem key={s.label} value={s.label}>
            <AccordionTrigger className="px-4 py-3.5">{s.label}</AccordionTrigger>
            <AccordionContent className="px-2 pb-3">
              {s.columns.map((c) => (
                <div key={c.title} className="mt-2 first:mt-0">
                  <p className="text-muted-foreground/80 px-2 pt-1 text-[11px] font-semibold tracking-[0.08em] uppercase">{c.title}</p>
                  {c.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="text-foreground hover:bg-foreground/[0.05] block rounded-lg px-2 py-2 text-[15px]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Link href={s.href} className="text-primary mt-1 inline-flex items-center gap-1 px-2 py-2 text-sm font-medium">
                {s.footer} <ArrowRight className="size-4" />
              </Link>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {menuLinks.map((l) => (
        <Link key={l.href} href={l.href} className="hover:bg-foreground/[0.05] block rounded-xl px-4 py-3.5 text-[15px] font-medium">
          {l.label}
        </Link>
      ))}
    </>
  );
}
