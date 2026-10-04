import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link2 } from "lucide-react";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/utils";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

function heading(Tag: "h2" | "h3") {
  return function Heading({ children }: { children?: ReactNode }) {
    const id = slugify(textOf(Children.toArray(children)));
    return (
      <Tag id={id} className="group scroll-mt-28">
        <a href={`#${id}`} className="text-inherit! no-underline! hover:no-underline!">
          {children}
          <Link2 className="text-muted-foreground ml-2 inline size-4 opacity-0 transition group-hover:opacity-100" aria-hidden />
        </a>
      </Tag>
    );
  };
}

/** Markdown for docs and blog posts: GitHub-flavored, anchored h2/h3 headings, client-side navigation for site links. */
export function Prose({ source, className }: { source: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert prose-headings:tracking-tight prose-h2:mt-12 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-foreground/[0.06] prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border prose-pre:bg-card prose-pre:text-foreground prose-table:text-sm prose-th:text-left prose-blockquote:border-primary/50 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-muted-foreground max-w-none",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: heading("h2"),
          h3: heading("h3"),
          a: ({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : href.startsWith("#") ? (
              <a href={href}>{children}</a>
            ) : (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {source}
      </Markdown>
    </div>
  );
}
