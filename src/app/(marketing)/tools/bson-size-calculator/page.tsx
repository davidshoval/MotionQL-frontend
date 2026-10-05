import { ToolPage, type Faq } from "@/components/tools/tool-page";
import { BsonSizeTool } from "@/components/tools/bson-size-tool";
import { toolMetadata } from "@/lib/tools/registry";

export const metadata = toolMetadata("bson-size-calculator");

// 16 MiB limit: https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-BSON-Document-Size
// Encoding sizes: https://bsonspec.org/spec.html
const faqs: Faq[] = [
  {
    q: "What is the maximum document size in MongoDB?",
    a: "16 MB (16,777,216 bytes) of BSON per document. Larger files belong in GridFS, and documents that keep growing, such as ever-longer arrays, are better split into several documents.",
  },
  {
    q: "How is the BSON size calculated?",
    a: "Exactly as the server encodes it: 4 bytes of length and 1 closing byte per document or array, then for each field a type byte, the key name in UTF-8 plus a terminating byte, and the value. For example an int32 takes 4 bytes, a double, long or date 8, an ObjectId 12, a Decimal128 16, and a string 4 + its UTF-8 bytes + 1.",
  },
  {
    q: "Why is my document bigger in BSON than in JSON?",
    a: 'Every field stores a type byte and a terminator, every string has a 4-byte length, and array elements store their index as a key ("0", "1", ...). Numbers can be smaller in BSON, but documents with many short values often grow. Long field names repeated in every document add up too.',
  },
  {
    q: "Does this match the server's $bsonSize?",
    a: "Yes, for the same typed values. Our test suite compares the results with MongoDB's own $bsonSize operator. Make sure numbers carry the type you store: a plain 1 is an int32 (4 bytes), while 1.5 or NumberLong(1) take 8 bytes.",
  },
  {
    q: "Is my data uploaded?",
    a: "No. The document, or a file you open, is read and measured in your browser. Nothing is sent to a server.",
  },
];

export default function Page() {
  return (
    <ToolPage
      slug="bson-size-calculator"
      faqs={faqs}
      cta="MotionQL's schema analysis shows field types and structure across a whole collection, with CSV, Markdown and HTML reports."
      about={
        <>
          <h2>Keeping documents small</h2>
          <ul>
            <li>
              <strong>Unbounded arrays</strong> are the usual reason documents approach 16 MB. Use the bucket or subset pattern, or move
              items to their own collection.
            </li>
            <li>
              <strong>Field names are stored in every document.</strong> In collections with millions of documents, a 20-character key costs
              20 bytes each time.
            </li>
            <li>
              <strong>Binary blobs</strong> such as images and PDFs belong in GridFS or object storage, with only a reference in the
              document.
            </li>
            <li>
              <strong>Pick the right number type.</strong> An int32 takes 4 bytes, a double or long 8, and a Decimal128 16.
            </li>
          </ul>
        </>
      }
    >
      <BsonSizeTool />
    </ToolPage>
  );
}
