import { ToolPage, type Faq } from "@/components/tools/tool-page";
import { OperatorsTool } from "@/components/tools/operators-tool";
import { toolMetadata } from "@/lib/tools/registry";

export const metadata = toolMetadata("operators-cheat-sheet");

// Operator semantics follow https://www.mongodb.com/docs/manual/reference/operator/
const faqs: Faq[] = [
  {
    q: "What is the difference between a query operator and an aggregation expression operator?",
    a: 'Query operators such as $gt and $in go in a find filter or a $match stage, written as { field: { $gt: 5 } }. Aggregation expression operators work on values inside pipeline stages, written as { $gt: ["$field", 5] }. Use $expr to use an aggregation expression in a query, for example to compare two fields.',
  },
  {
    q: "What is the difference between $project, $addFields and $set?",
    a: "$project reshapes documents: you list what to keep or compute and everything else is dropped (except _id). $addFields adds or overwrites fields and keeps the rest. $set is an alias of $addFields.",
  },
  {
    q: "How do I join collections in MongoDB?",
    a: "Use the $lookup stage. The simple form matches localField to foreignField; the pipeline form lets you add conditions and reshape the joined documents. Index the foreignField in the joined collection to keep it fast.",
  },
  {
    q: "Why should $match and $sort come first in a pipeline?",
    a: "At the start of a pipeline they can use indexes, and filtering early means later stages handle fewer documents. After a $group, $project or $unwind, they run on the stage output in memory.",
  },
  {
    q: "Which MongoDB version do these operators need?",
    a: "Operators marked with a version badge were added in that release; the rest are available in all currently supported MongoDB versions. Each name links to the official documentation with full details.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="operators-cheat-sheet"
      faqs={faqs}
      privacy="Free, no sign-up. Search runs in your browser and nothing you type is sent to any server."
      cta="MotionQL's aggregation editor previews every stage as you build it, with the full operator library and templates."
    >
      <OperatorsTool />
    </ToolPage>
  );
}
