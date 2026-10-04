import { ToolPage, type Faq } from "@/components/tools/tool-page";
import { ExplainPlanTool } from "@/components/tools/explain-plan-tool";
import { toolMetadata } from "@/lib/tools/registry";

export const metadata = toolMetadata("explain-plan-analyzer");

// Explain output reference: https://www.mongodb.com/docs/manual/reference/explain-results/
// ESR guideline: https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-guideline/
// Slow query threshold (slowms, 100 ms default): https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-operationProfiling.slowOpThresholdMs
const faqs: Faq[] = [
  {
    q: "How do I get explain output to paste here?",
    a: 'Append .explain("executionStats") to a find, e.g. db.orders.find({ status: "A" }).sort({ createdAt: -1 }).explain("executionStats"), or use db.orders.explain("executionStats").aggregate([...]) for a pipeline. Copy the whole result. mongosh output with Long(...) and other shell types is fine.',
  },
  {
    q: "What does COLLSCAN mean in a MongoDB explain plan?",
    a: "A collection scan: MongoDB read every document to find the matches because no index fit the filter. It's fine on tiny collections and a common cause of slow queries on large ones. The fix is usually an index on the filtered fields.",
  },
  {
    q: "What is an in-memory (blocking) SORT stage?",
    a: "A SORT stage means MongoDB collected the results and sorted them itself instead of reading them in order from an index. It has to buffer the results first, has a 100 MB memory limit before it must spill to disk, and can't return the first document until all are sorted. An index whose keys match the sort removes it.",
  },
  {
    q: "How is the index suggestion built?",
    a: "From the filter and sort in the plan, using MongoDB's Equality, Sort, Range (ESR) guideline: fields matched by equality first, then sort fields in their sort direction, then fields used in ranges ($gt, $lt, $ne, $regex ...). Queries using $or, $expr or $text are only partly analysed.",
  },
  {
    q: "Is it safe to paste production explain output?",
    a: "The analysis runs in your browser and nothing is uploaded. Explain output can still contain filter values and server names, so treat it like the query itself when sharing.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="explain-plan-analyzer"
      faqs={faqs}
      cta="MotionQL has an Explain tab on every query and flags COLLSCAN and in-memory sorts with a badge before you run the query."
      about={
        <>
          <h2>Reading an explain plan</h2>
          <p>
            A plan is a tree of stages. The innermost stage reads data (<code>COLLSCAN</code> or <code>IXSCAN</code>), and each stage above
            it filters, fetches, sorts or projects. Three numbers tell most of the story:
          </p>
          <ul>
            <li>
              <strong>nReturned</strong>: documents the query returned.
            </li>
            <li>
              <strong>totalKeysExamined</strong>: index entries read. Ideally close to nReturned.
            </li>
            <li>
              <strong>totalDocsExamined</strong>: documents loaded. Zero for a covered query; far above nReturned means the index is not
              selective enough, or there is none.
            </li>
          </ul>
          <p>
            Good plans read about as many keys and documents as they return, and have no <code>COLLSCAN</code> or <code>SORT</code> stage.
            When there is a sort, put equality fields first in the index, then the sort fields, then range fields.
          </p>
        </>
      }
    >
      <ExplainPlanTool />
    </ToolPage>
  );
}
