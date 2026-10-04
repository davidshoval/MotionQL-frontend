"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { bsonTypeName, parseEJson, stringifyEJson, type BValue, type OutputFormat } from "@/lib/tools/ejson";
import { CodeBlock, CopyText, ErrorText, Panel, monoArea, selectClass } from "./shared";

const EXAMPLE = `{
  _id: ObjectId("65f1a2b3c4d5e6f708192a3b"),
  name: "Ada Lovelace",
  balance: NumberDecimal("1024.50"),
  visits: NumberLong("9007199254740993"),
  score: 4.5,
  joined: ISODate("2024-03-13T09:30:00Z"),
  tags: ["admin", "beta"],
  avatar: BinData(0, "iVBORw0KGgo="),
  sessionId: UUID("3b241101-e2bb-4255-8caf-4136c566a962"),
  email: /@example\\.com$/i,
  lastSync: Timestamp({ t: 1710322200, i: 1 })
}`;

const FORMATS: { id: OutputFormat; label: string }[] = [
  { id: "canonical", label: "Canonical EJSON" },
  { id: "relaxed", label: "Relaxed EJSON" },
  { id: "shell", label: "Shell (mongosh)" },
];

function detect(text: string): string {
  if (
    /\b(ObjectId|ISODate|NumberLong|NumberInt|NumberDecimal|Decimal128|BinData|UUID|Timestamp|Long|Int32|Double)\s*\(/.test(text) ||
    /^\s*\{\s*[A-Za-z_$][\w$]*\s*:/m.test(text)
  )
    return "shell syntax";
  if (/"\$number(Int|Double)"/.test(text)) return "canonical Extended JSON";
  if (/"\$(oid|date|numberLong|numberDecimal|binary|timestamp|regularExpression)"/.test(text)) return "relaxed Extended JSON";
  return "plain JSON";
}

function countTypes(v: BValue, acc: Map<string, number>) {
  if (v.t === "doc") v.entries.forEach(([, x]) => countTypes(x, acc));
  else if (v.t === "array") v.items.forEach((x) => countTypes(x, acc));
  else acc.set(bsonTypeName(v), (acc.get(bsonTypeName(v)) ?? 0) + 1);
  return acc;
}

export function ExtendedJsonTool() {
  const [input, setInput] = useState(EXAMPLE);
  const [format, setFormat] = useState<OutputFormat>("canonical");
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => {
    try {
      const v = parseEJson(input);
      return { value: v, types: [...countTypes(v, new Map()).entries()].sort((a, b) => b[1] - a[1]) };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [input]);
  const output = "value" in result && result.value ? stringifyEJson(result.value, format, { indent }) : "";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title={<label htmlFor="ejson-input">Input: JSON, Extended JSON or shell syntax</label>}
        actions={
          <>
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput(EXAMPLE)}>
              Example
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput("")}>
              Clear
            </Button>
          </>
        }
      >
        <Textarea
          id="ejson-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          wrap="off"
          rows={18}
          className={`${monoArea} min-h-[26rem]`}
          aria-invalid={"error" in result}
          placeholder='{ "_id": { "$oid": "..." } } or { _id: ObjectId("...") }'
        />
        {"error" in result ? (
          input.trim() && <ErrorText>{result.error}</ErrorText>
        ) : (
          <p className="text-muted-foreground mt-2 text-xs">
            Read as {detect(input)}
            {result.types.length > 0 && <> · {result.types.map(([t, n]) => `${n} ${t}`).join(", ")}</>}
          </p>
        )}
      </Panel>

      <Panel
        title="Output"
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!output}
              onClick={() => setInput(output)}
              title="Use the output as the new input"
            >
              <ArrowRightLeft /> Use as input
            </Button>
            <CopyText value={output} />
          </>
        }
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Tabs value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
            <TabsList aria-label="Output format" className="flex-wrap">
              {FORMATS.map((f) => (
                <TabsTrigger key={f.id} value={f.id}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <label className="text-muted-foreground flex items-center gap-2 text-xs">
            Indent
            <select className={`${selectClass} h-8 w-24 text-sm`} value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Compact</option>
            </select>
          </label>
        </div>
        <CodeBlock value={output || " "} className="min-h-[26rem]" wrap={indent === 0} />
      </Panel>
    </div>
  );
}
