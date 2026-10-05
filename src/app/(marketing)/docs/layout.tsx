import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsSearch } from "@/components/docs/search";
import { buildSearchIndex, docSections } from "@/lib/docs";

export default async function DocsLayout({ children }: LayoutProps<"/docs">) {
  const index = await buildSearchIndex();
  return (
    <div className="container-page grid gap-10 pt-28 pb-8 sm:pt-32 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14">
      <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-2 lg:pb-8">
        <div className="mb-6">
          <DocsSearch index={index} />
        </div>
        <DocsSidebar sections={docSections} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
