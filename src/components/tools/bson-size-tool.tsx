"use client";

import { useMemo, useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BSON_MAX_SIZE, analyzeSize, documentSize, fieldSizes, formatBytes } from "@/lib/tools/bson-size";
import { bsonTypeName, parseEJson, type BDoc, type BValue } from "@/lib/tools/ejson";
import { cn } from "@/lib/utils";
import { ErrorText, Panel, Stat, monoArea } from "./shared";

const EXAMPLE = `{
  _id: ObjectId("65f1a2b3c4d5e6f708192a3b"),
  sku: "TSHIRT-RED-M",
  title: "Organic cotton T-shirt",
  price: NumberDecimal("24.90"),
  stock: 132,
  updatedAt: ISODate("2024-03-13T09:30:00Z"),
  attributes: { color: "red", size: "M", material: "cotton", fit: "regular" },
  reviews: [
    { user: "ana", rating: 5, text: "Fits perfectly and the fabric is soft after many washes." },
    { user: "ben", rating: 4, text: "Good shirt, runs a little large." }
  ],
  thumbnail: BinData(0, "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
}`;

const MAX_FILE = 64 * 1024 * 1024;

type Parsed = { error: string } | { docs: BDoc[]; isArray: boolean };

function typeLabel(t: BValue["t"]) {
  return bsonTypeName({ t } as BValue);
}

export function BsonSizeTool() {
  const [input, setInput] = useState(EXAMPLE);
  const [scope, setScope] = useState<"top" | "all">("all");
  const [pick, setPick] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");

  const parsed: Parsed = useMemo(() => {
    try {
      const v = parseEJson(input);
      if (v.t === "doc") return { docs: [v], isArray: false };
      if (v.t === "array") {
        const docs = v.items.filter((x): x is BDoc => x.t === "doc");
        if (!docs.length || docs.length !== v.items.length) return { error: "An array must contain only documents." };
        return { docs, isArray: true };
      }
      return { error: "Paste a document ({ ... }) or an array of documents." };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [input]);

  const sizes = useMemo(() => ("docs" in parsed ? parsed.docs.map(documentSize) : []), [parsed]);
  const largestIdx = sizes.reduce((best, s, i) => (s > sizes[best] ? i : best), 0);
  const idx = pick !== null && pick < sizes.length ? pick : largestIdx;
  const doc = "docs" in parsed ? parsed.docs[idx] : null;
  const report = useMemo(() => (doc ? analyzeSize(doc, 25) : null), [doc]);
  const rows = useMemo(() => {
    if (!doc || !report) return [];
    return scope === "top"
      ? report.topLevel
      : fieldSizes(doc)
          .sort((a, b) => b.bytes - a.bytes)
          .slice(0, 25);
  }, [doc, report, scope]);

  const loadFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_FILE) return setFileError(`That file is ${formatBytes(f.size)}; the limit here is ${formatBytes(MAX_FILE)}.`);
    setFileError("");
    f.text().then((t) => {
      setPick(null);
      setInput(t);
    });
  };

  const pct = report ? report.ratio * 100 : 0;
  const tone = !report ? undefined : report.overLimit ? "error" : report.ratio > 0.75 ? "warning" : "good";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <Panel
        title={<label htmlFor="bson-input">Document (JSON, Extended JSON or shell syntax)</label>}
        actions={
          <>
            <input
              ref={fileRef}
              type="file"
              accept=".json,.txt,application/json,text/plain"
              className="hidden"
              onChange={(e) => loadFile(e.target.files?.[0])}
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
              <FileUp /> Open file
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPick(null);
                setInput(EXAMPLE);
              }}
            >
              Example
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput("")}>
              Clear
            </Button>
          </>
        }
      >
        <Textarea
          id="bson-input"
          value={input}
          onChange={(e) => {
            setPick(null);
            setInput(e.target.value);
          }}
          spellCheck={false}
          wrap="off"
          rows={20}
          className={`${monoArea} min-h-[28rem]`}
          aria-invalid={"error" in parsed}
        />
        {fileError && <ErrorText>{fileError}</ErrorText>}
        {"error" in parsed && input.trim() && <ErrorText>{parsed.error}</ErrorText>}
        <p className="text-muted-foreground mt-2 text-xs">
          Files are read by your browser and never uploaded. Plain numbers are typed like mongosh: 32-bit integers as int32, everything else
          as double.
        </p>
      </Panel>

      <div className="grid content-start gap-4">
        {report && (
          <Panel title={"docs" in parsed && parsed.isArray ? `Document ${idx + 1} of ${sizes.length}` : "Size"}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat
                label="BSON size"
                value={formatBytes(report.bytes)}
                hint={`${report.bytes.toLocaleString("en-US")} bytes`}
                tone={tone}
              />
              <Stat
                label="Of the 16 MB limit"
                value={pct < 0.01 ? "<0.01%" : `${pct.toFixed(pct < 1 ? 2 : 1)}%`}
                hint={report.overLimit ? "Too large to insert" : `${formatBytes(BSON_MAX_SIZE - report.bytes)} to spare`}
                tone={tone}
              />
              <Stat label="Fields / depth" value={`${report.fieldCount} / ${report.maxDepth}`} hint="Elements at every level" />
            </div>
            <div className="mt-4" aria-hidden>
              <div className="bg-foreground/[0.06] h-2.5 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full",
                    report.overLimit ? "bg-destructive" : report.ratio > 0.75 ? "bg-warning" : "bg-primary",
                  )}
                  style={{ width: `${Math.max(Math.min(pct, 100), 0.5)}%` }}
                />
              </div>
              <div className="text-muted-foreground mt-1.5 flex justify-between text-[11px]">
                <span>0</span>
                <span>8 MB</span>
                <span>16 MB</span>
              </div>
            </div>
          </Panel>
        )}

        {"docs" in parsed && parsed.isArray && (
          <Panel title={`${sizes.length} documents · ${formatBytes(sizes.reduce((a, b) => a + b, 0))} total`}>
            <ul className="grid max-h-56 gap-1 overflow-auto text-sm">
              {sizes.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setPick(i)}
                    className={cn(
                      "hover:bg-foreground/[0.05] flex w-full cursor-pointer justify-between rounded-lg px-2.5 py-1.5 text-left",
                      i === idx && "bg-foreground/[0.07]",
                    )}
                  >
                    <span>
                      Document {i + 1}
                      {i === largestIdx && <span className="text-muted-foreground"> (largest)</span>}
                    </span>
                    <span className="font-mono">{formatBytes(s)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {report && (
          <Panel
            title="Biggest fields"
            actions={
              <Tabs value={scope} onValueChange={(v) => setScope(v as "top" | "all")}>
                <TabsList aria-label="Field scope">
                  <TabsTrigger value="all">Any depth</TabsTrigger>
                  <TabsTrigger value="top">Top level</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          >
            <table className="w-full table-fixed text-left text-sm">
              <thead className="text-muted-foreground text-xs">
                <tr className="border-border border-b">
                  <th className="py-2 pr-3 font-normal">Field</th>
                  <th className="w-24 py-2 pr-3 font-normal">Type</th>
                  <th className="w-40 py-2 text-right font-normal">Size</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((f) => (
                  <tr key={f.path} className="border-border border-b last:border-0">
                    <td className="truncate py-2 pr-3 font-mono" title={f.path}>
                      {f.path}
                    </td>
                    <td className="text-muted-foreground py-2 pr-3 text-xs">{typeLabel(f.type)}</td>
                    <td className="py-2">
                      <div className="flex items-center justify-end gap-2">
                        <div className="bg-foreground/[0.06] hidden h-1.5 w-16 overflow-hidden rounded-full sm:block" aria-hidden>
                          <div className="bg-primary h-full" style={{ width: `${(f.bytes / report.bytes) * 100}%` }} />
                        </div>
                        <span className="w-20 text-right font-mono tabular-nums">{formatBytes(f.bytes)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-muted-foreground mt-3 text-xs">
              A field&apos;s size includes its key name, a type byte and everything nested inside it. The document adds 5 bytes of framing.
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
