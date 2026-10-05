import Image from "next/image";
import { cn } from "@/lib/utils";

/** A real app screenshot from public/screens in a window frame, swapping dark and light with the theme. */
export function ScreenFrame({ id, alt, priority, className }: { id: string; alt: string; priority?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-card relative overflow-hidden rounded-2xl border shadow-[0_40px_120px_-40px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
        className,
      )}
    >
      <div className="border-border flex items-center gap-1.5 border-b px-4 py-2.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={`/screens/dark-${id}.webp`}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="hidden object-cover object-top dark:block"
          priority={priority}
        />
        <Image
          src={`/screens/light-${id}.webp`}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover object-top dark:hidden"
        />
      </div>
    </div>
  );
}
