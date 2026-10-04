import { ToolPage, type Faq } from "@/components/tools/tool-page";
import { ExtendedJsonTool } from "@/components/tools/extended-json-tool";
import { toolMetadata } from "@/lib/tools/registry";

export const metadata = toolMetadata("extended-json-converter");

// Format rules: https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/
// and the Extended JSON spec: https://github.com/mongodb/specifications/blob/master/source/extended-json/extended-json.md
const faqs: Faq[] = [
  {
    q: "What is the difference between canonical and relaxed Extended JSON?",
    a: 'Canonical mode wraps every value whose type JSON can\'t express exactly, including all numbers ({"$numberInt": "1"}) and dates as milliseconds ({"$date": {"$numberLong": "..."}}), so nothing is lost. Relaxed mode writes int32, doubles and safe 64-bit integers as plain JSON numbers and dates between 1970 and 9999 as ISO strings, which is easier to read but can lose type information.',
  },
  {
    q: "How do I convert ISODate() and ObjectId() from mongosh into valid JSON?",
    a: 'Paste the shell output on the left. ObjectId("...") becomes {"$oid": "..."}, ISODate("...") becomes {"$date": ...}, NumberLong becomes {"$numberLong": "..."} and so on. Unquoted keys, single quotes, comments and trailing commas are accepted.',
  },
  {
    q: "How are plain numbers typed?",
    a: "The same way mongosh and the Node.js driver type them: a whole number that fits in 32 bits is an int32, anything else is a double. Use NumberLong(...), NumberDecimal(...) or the canonical wrappers to get a 64-bit integer or Decimal128.",
  },
  {
    q: "Which BSON types are supported?",
    a: "Double, string, document, array, binary (including UUID), undefined, ObjectId, boolean, date, null, regular expression, JavaScript code (with and without scope), symbol, int32, timestamp, int64, Decimal128, MinKey and MaxKey. The deprecated DBPointer type is not supported.",
  },
  {
    q: "Does the converter upload my documents?",
    a: "No. Parsing and conversion run in your browser. Nothing you paste leaves the page.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="extended-json-converter"
      faqs={faqs}
      cta="In MotionQL you can copy any document as Extended JSON or shell syntax, and import or export JSON, JSON Lines, CSV, BSON and Excel."
      about={
        <>
          <h2>Three ways to write the same document</h2>
          <p>
            JSON has no ObjectId, date, 64-bit integer or binary type, so MongoDB defines <strong>Extended JSON</strong>: special keys
            starting with <code>$</code> that carry the BSON type. The same value looks different in each format:
          </p>
          <ul>
            <li>
              Shell: <code>ISODate(&quot;2024-03-13T09:30:00Z&quot;)</code>
            </li>
            <li>
              Relaxed: <code>{`{"$date": "2024-03-13T09:30:00Z"}`}</code>
            </li>
            <li>
              Canonical: <code>{`{"$date": {"$numberLong": "1710322200000"}}`}</code>
            </li>
          </ul>
          <p>
            Use <strong>canonical</strong> when the data must round-trip exactly (backups, fixtures, cross-language tests),{" "}
            <strong>relaxed</strong> for logs and APIs people read, and <strong>shell</strong> syntax to paste into mongosh. Query operators
            such as <code>$gt</code> or <code>$in</code> are left untouched, so you can convert filters and pipelines too.
          </p>
        </>
      }
    >
      <ExtendedJsonTool />
    </ToolPage>
  );
}
