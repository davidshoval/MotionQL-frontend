import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const legalLinks: Record<string, string> = {
  "EULA.md": "/legal/eula",
  "TERMS_OF_SERVICE.md": "/legal/terms",
  "PRIVACY_POLICY.md": "/legal/privacy",
  "ACCEPTABLE_USE.md": "/legal/acceptable-use",
  "SECURITY_POLICY.md": "/legal/security-policy",
};

/** Links in the copied docs point at files in the app repo; send them to the matching site page instead. */
function rewrite(href?: string) {
  if (!href) return href;
  const file = href.replace(/^\.{1,2}\/(legal\/)?/, "").split("#")[0];
  if (legalLinks[file]) return legalLinks[file] + (href.includes("#") ? "#" + href.split("#")[1] : "");
  if (href.startsWith("../docs/") || href.startsWith("docs/")) return "/features";
  return href;
}

export function MarkdownDoc({ source, className }: { source: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-foreground/[0.06] prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-table:text-sm prose-th:text-left max-w-none",
        className,
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, ...p }) => <a href={rewrite(href)} {...p} /> }}>
        {source}
      </Markdown>
    </div>
  );
}
