"use client";

import { motion } from "motion/react";
import { Check, Cpu, KeyRound, Lock, Sparkles, X } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const sees = ["Your request", "Database, collection and field names", "Field types and indexes", "Explain-plan structure"];
const never = ["Document values", "Passwords and connection strings", "Your queries' results"];

export function AiSection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_70%_50%,color-mix(in_oklch,var(--brand-violet)_14%,transparent),transparent)]"
      />
      <div className="container-page grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow={
              <>
                <Sparkles className="size-3" /> AI assistant
              </>
            }
            title={
              <>
                AI that knows your schema.
                <br />
                <span className="text-gradient-brand">Not your data.</span>
              </>
            }
            description="Describe what you want in plain English and get a query, a pipeline or SQL. Ask why a query is slow, fix an error, or get index advice. It works with your own Gemini, Claude or OpenAI-compatible key, or a local model."
          />
          <Reveal delay={0.1} className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium">What the AI sees</p>
              <ul className="mt-3 space-y-2">
                {sees.map((s) => (
                  <li key={s} className="text-muted-foreground flex items-start gap-2 text-[15px]">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">What it never sees</p>
              <ul className="mt-3 space-y-2">
                {never.map((s) => (
                  <li key={s} className="text-muted-foreground flex items-start gap-2 text-[15px]">
                    <X className="text-destructive mt-0.5 size-4 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-2">
            {[
              { i: KeyRound, t: "Bring your own key" },
              { i: Cpu, t: "Local models via Ollama" },
              { i: Lock, t: "Off until you allow it, per connection" },
            ].map(({ i: Icon, t }) => (
              <span
                key={t}
                className="border-border bg-foreground/[0.03] text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px]"
              >
                <Icon className="text-brand-violet size-3.5" /> {t}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="border-beam rounded-3xl p-1 shadow-[0_30px_100px_-30px_color-mix(in_oklch,var(--brand-violet)_45%,transparent)]">
            <div className="bg-card rounded-[1.3rem] p-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="bg-brand-violet/15 text-brand-violet grid size-7 place-items-center rounded-lg">
                  <Sparkles className="size-4" />
                </span>
                Ask your database
                <span className="bg-foreground/5 text-muted-foreground ml-auto rounded-md px-2 py-0.5 font-mono text-[11px]">
                  shop.orders
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-primary text-primary-foreground mt-5 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-[15px]"
              >
                Top 5 cities by revenue from shipped orders last month
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="border-border bg-background/60 mt-4 rounded-2xl rounded-bl-md border p-4 font-mono text-[12.5px] leading-relaxed"
              >
                <span className="text-muted-foreground">db.orders.aggregate([</span>
                <br />
                {"  "}
                <span className="text-brand-violet">{"{ $match"}</span>: {"{ status: "}
                <span className="text-primary">&quot;shipped&quot;</span>, createdAt: {"{ "}
                <span className="text-brand-violet">$gte</span>: ISODate(<span className="text-primary">&quot;2026-09-01&quot;</span>){" "}
                {"} } },"}
                <br />
                {"  "}
                <span className="text-brand-violet">{"{ $group"}</span>: {"{ _id: "}
                <span className="text-primary">&quot;$customer.city&quot;</span>, revenue: {"{ "}
                <span className="text-brand-violet">$sum</span>: <span className="text-primary">&quot;$total&quot;</span>
                {" } } },"}
                <br />
                {"  "}
                <span className="text-brand-violet">{"{ $sort"}</span>: {"{ revenue: "}
                <span className="text-warning">-1</span>
                {" } },"} <span className="text-brand-violet">{"{ $limit"}</span>: <span className="text-warning">5</span>
                {" }"}
                <br />
                <span className="text-muted-foreground">])</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4 }}
                className="text-muted-foreground mt-4 flex flex-wrap items-center gap-2 text-[12px]"
              >
                <span className="bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full px-2.5 py-1">
                  <Check className="size-3" /> Validated before display
                </span>
                <span>Uses index status_1_createdAt_-1</span>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
