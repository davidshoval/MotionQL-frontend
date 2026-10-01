import { Aurora } from "./aurora";
import { Eyebrow } from "./section-heading";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pt-40 pb-16 sm:pt-48">
      <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
      <Aurora className="-z-10 opacity-70" />
      <div className="container-page flex flex-col items-center text-center">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-gradient mt-6 max-w-4xl text-5xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
