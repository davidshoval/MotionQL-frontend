import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Pricing, the free Pro year, platforms, installer warnings, data privacy and teams: answers about MotionQL.",
  alternates: { canonical: "/faq" },
};

interface Item {
  q: string;
  a: string;
  more?: { href: string; label: string };
}

// Facts come from the desktop app's docs (FAQ.md, INSTALLATION.md, LICENSING.md, USER_GUIDE.md) and the pricing page.
const groups: { title: string; items: Item[] }[] = [
  {
    title: "Pricing and the free year",
    items: [
      {
        q: "How much does MotionQL cost?",
        a: "Nothing today. The core app is free forever and needs no license key. When you create an account you also get a Pro license, free for 12 months, with no credit card. Team seats are free for now too.",
        more: { href: "/pricing", label: "See pricing" },
      },
      {
        q: "What's free, and what does Pro add?",
        a: "Free covers connections with every auth method, the query bar and visual query builder, IntelliShell, the aggregation editor, SQL Query, Query Code, import and export, dump and restore, Compare and Sync, schema tools, indexes, the profiler, dashboards and the AI assistant with your own key. Pro adds SQL Migration, Data Masking, scheduled tasks and MongoDB Atlas management.",
      },
      {
        q: "How do I get the free Pro year?",
        a: "Create an account at motionql.com, confirm your email, and copy the Pro key from your account page. In MotionQL, open Settings → License, paste the key and click Activate. Activation happens offline.",
        more: { href: "/docs/activate", label: "Step-by-step guide" },
      },
      {
        q: "What happens after the 12 months?",
        a: "While the free launch offer runs, you renew for another year with one click on your account page and paste the new key. If we ever start charging for Pro, you'll see the price before your year ends, and everything that's free today stays free. If a key does expire, only the Pro features stop: MotionQL still opens, connects and shows your data, and nothing on your computer is deleted.",
      },
      {
        q: "Can I use MotionQL for commercial work?",
        a: "Yes. The free edition may be used for any lawful purpose, including commercial use by individuals and organizations. A Pro license covers the internal business use of the person it's issued to, on up to three of their devices. The EULA has the details.",
        more: { href: "/legal/eula", label: "Read the EULA" },
      },
    ],
  },
  {
    title: "Platforms and installing",
    items: [
      {
        q: "Which operating systems are supported?",
        a: "macOS 12 or later on Apple silicon and Intel, and Windows 10 or 11 (64-bit). Linux (AppImage and deb) arrives with the next release, for 64-bit x86 desktops. MotionQL works with MongoDB 4.4 and later, including Atlas, replica sets and sharded clusters, plus Amazon DocumentDB, Azure Cosmos DB for MongoDB and FerretDB within the features those services implement.",
        more: { href: "/docs/install", label: "System requirements" },
      },
      {
        q: "Why does macOS or Windows warn me about the installer?",
        a: "The current installers aren't code-signed yet, so macOS Gatekeeper and Windows SmartScreen show a warning the first time you open them. On macOS, open System Settings → Privacy & Security and click Open Anyway. On Windows, click More info → Run anyway. Every release lists SHA-256 checksums so you can confirm the file is the one we published. Signed builds and in-app updates will follow.",
        more: { href: "/docs/install#about-the-security-warnings", label: "Install guide" },
      },
      {
        q: "How do I update MotionQL?",
        a: "Download the new version from the download page and install it over the old one. Your connections and settings are kept. In-app updates need signed builds, so they're off for now.",
      },
    ],
  },
  {
    title: "Data and privacy",
    items: [
      {
        q: "Does my data go to MotionQL?",
        a: "No. MotionQL connects directly from your computer to your databases. We never receive your documents, queries, connection strings or credentials. Passwords are encrypted with your operating system's keychain and stay on your computer.",
        more: { href: "/security", label: "How MotionQL keeps data safe" },
      },
      {
        q: "Does MotionQL send anything at all?",
        a: "If you allow it on first run, MotionQL sends anonymous usage statistics once a day: a random install ID, the app version, the OS and the license edition. It also downloads a small signed file with notices and cancelled license keys; that request carries no identifiers. Crash reports are off unless you turn them on in Settings → Diagnostics.",
      },
      {
        q: "Does license activation phone home?",
        a: "No. Keys are verified offline with a digital signature, so MotionQL works behind firewalls and on air-gapped machines.",
      },
      {
        q: "What does the AI assistant see?",
        a: "It's off for every connection until you turn it on and add your own provider key. Then it sees your request plus database, collection and field names, types, indexes and the shape of explain plans. Document values, passwords and connection strings aren't sent, and requests go straight to your provider, not through us.",
        more: { href: "/docs/ai-mcp", label: "AI assistant docs" },
      },
      {
        q: "How do I get a free Gemini API key for the AI assistant?",
        a: "Go to Google AI Studio at aistudio.google.com/app/apikey, sign in with your Google account and click Create API key. Copy the key, then in MotionQL open Settings → AI, choose Google Gemini, paste it and click Save, then Test connection. Google's free tier has per-minute and per-day rate limits that vary by model. Under Google's Gemini API terms, content sent to unpaid services is used to improve Google's products and may be read by human reviewers, so Google asks you not to send sensitive, confidential or personal information on the free tier. Paid usage isn't used that way.",
        more: { href: "/docs/ai-mcp#get-a-free-gemini-api-key", label: "Step-by-step guide" },
      },
    ],
  },
  {
    title: "Teams",
    items: [
      {
        q: "Is there a version for teams?",
        a: "Yes, and team seats are free for now. Create a team from your account, invite people by email, and assign each member a seat. Each member gets their own Pro key. Owners and admins can free a seat, reissue a key or remove someone at any time, and every change is logged.",
        more: { href: "/docs/licensing-teams", label: "Licensing and teams" },
      },
      {
        q: "Can IT deploy MotionQL and a license to many computers?",
        a: "Yes. The Windows installer supports silent installs (/S, /allusers), and a license key can be placed in MotionQL's machine policy file so users don't need to paste one. The same file can turn off AI, force read-only connections and more.",
      },
      {
        q: "Do you offer invoicing or a signed agreement?",
        a: `Write to ${site.contactEmail} and tell us what you need.`,
      },
    ],
  },
];

export default function FaqPage() {
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions, answered" description="Pricing, the free year, platforms, privacy and teams." />
      <section className="container-page max-w-3xl space-y-14 pb-8">
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="text-xl font-semibold tracking-tight">{g.title}</h2>
            <Accordion type="multiple" className="mt-4">
              {g.items.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>
                    <p>{f.a}</p>
                    {f.more && (
                      <Link
                        href={f.more.href}
                        className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                      >
                        {f.more.label} <ArrowRight className="size-3.5" />
                      </Link>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
        <p className="text-muted-foreground border-border border-t pt-8 text-sm">
          Still have a question?{" "}
          <Link href="/support" className="text-primary hover:underline">
            Contact support
          </Link>{" "}
          or browse the{" "}
          <Link href="/docs" className="text-primary hover:underline">
            documentation
          </Link>
          .
        </p>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </>
  );
}
