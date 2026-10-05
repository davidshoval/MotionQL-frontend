import { ToolPage, type Faq } from "@/components/tools/tool-page";
import { ObjectIdTool } from "@/components/tools/objectid-tool";
import { toolMetadata } from "@/lib/tools/registry";

export const metadata = toolMetadata("objectid-converter");

// ObjectId layout: https://www.mongodb.com/docs/manual/reference/method/ObjectId/
const faqs: Faq[] = [
  {
    q: "How do I get the creation date from a MongoDB ObjectId?",
    a: 'The first 4 bytes (8 hex characters) are a Unix timestamp in seconds. Paste the id above to see it as a date, or in mongosh call ObjectId("...").getTimestamp().',
  },
  {
    q: "What are the other 8 bytes of an ObjectId?",
    a: "A 5-byte random value generated once per process, and a 3-byte counter that starts at a random number and increases for every id that process creates. Together they keep ids unique without coordination between machines.",
  },
  {
    q: "Can I query documents by creation time using _id?",
    a: 'Yes. Build an ObjectId from a date with the remaining bytes set to zero and use it as a range bound, for example { _id: { $gte: ObjectId("<from>"), $lt: ObjectId("<to>") } }. The query uses the _id index, and the generator above writes it for you.',
  },
  {
    q: "Is the ObjectId timestamp accurate to the millisecond?",
    a: "No, only to the second, and it reflects the clock of the client or server that created the id. Ids made in the same second by different processes are not strictly ordered.",
  },
  {
    q: "Are the ObjectIds generated here sent anywhere or reserved?",
    a: "No. They are generated in your browser with the Web Crypto random number generator. ObjectIds are not registered anywhere; uniqueness comes from the timestamp, random value and counter.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="objectid-converter"
      faqs={faqs}
      cta="Build _id range filters in MotionQL's visual query builder or shell-syntax filter bar, and browse the results in tree, table and JSON views."
      about={
        <>
          <h2>How a MongoDB ObjectId is built</h2>
          <p>An ObjectId is 12 bytes, usually written as 24 hexadecimal characters:</p>
          <ul>
            <li>
              <strong>4-byte timestamp</strong>: seconds since 1970-01-01 UTC, big-endian, so ids sort roughly by creation time.
            </li>
            <li>
              <strong>5-byte random value</strong>: chosen once per process, unique to the machine and process.
            </li>
            <li>
              <strong>3-byte counter</strong>: incremented for each new id, starting from a random value.
            </li>
          </ul>
          <p>
            The 4-byte timestamp runs out in February 2106. Because the timestamp comes first, sorting by <code>_id</code> is a cheap way to
            get documents in insertion order, and a range on <code>_id</code> is a cheap way to select documents by creation date.
          </p>
        </>
      }
    >
      <ObjectIdTool />
    </ToolPage>
  );
}
