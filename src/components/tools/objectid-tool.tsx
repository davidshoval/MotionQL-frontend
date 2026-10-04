"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { decodeMany, generateObjectIds, objectIdForDate } from "@/lib/tools/objectid";
import { CodeBlock, CopyText, ErrorText, Panel, monoArea } from "./shared";

const EXAMPLE = `507f1f77bcf86cd799439011
ObjectId("65f1a2b3c4d5e6f708192a3b")`;

/** Parses a <input type="datetime-local"> value (local time); empty means now. */
function fromLocalInput(v: string): Date | null {
  if (!v) return new Date();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function relative(date: Date): string {
  const s = Math.round((Date.now() - date.getTime()) / 1000);
  const abs = Math.abs(s);
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [n, u] of units) {
    if (abs >= n) {
      const v = Math.floor(abs / n);
      return s >= 0 ? `${v} ${u}${v > 1 ? "s" : ""} ago` : `in ${v} ${u}${v > 1 ? "s" : ""}`;
    }
  }
  return "just now";
}

export function ObjectIdTool() {
  const [text, setText] = useState(EXAMPLE);
  const rows = useMemo(() => decodeMany(text), [text]);

  const [genDate, setGenDate] = useState("");
  const [count, setCount] = useState(5);
  const [generated, setGenerated] = useState<string[]>([]);
  const [genError, setGenError] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const generate = () => {
    const d = fromLocalInput(genDate);
    if (!d) return setGenError("Enter a valid date and time.");
    try {
      setGenerated(generateObjectIds(Math.max(1, Math.min(1000, count || 1)), d));
      setGenError("");
    } catch (e) {
      setGenError((e as Error).message);
    }
  };

  const range = useMemo(() => {
    if (!from && !to) return null;
    try {
      const parts: string[] = [];
      if (from) parts.push(`$gte: ObjectId("${objectIdForDate(new Date(from))}")`);
      if (to) parts.push(`$lt: ObjectId("${objectIdForDate(new Date(to))}")`);
      return { query: `db.collection.find({ _id: { ${parts.join(", ")} } })` };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [from, to]);

  return (
    <div className="grid gap-4">
      <Panel
        title={<label htmlFor="oid-input">Decode ObjectIds (one per line)</label>}
        actions={
          <Button type="button" variant="ghost" size="sm" onClick={() => setText("")}>
            Clear
          </Button>
        }
      >
        <Textarea
          id="oid-input"
          rows={4}
          value={text}
          spellCheck={false}
          onChange={(e) => setText(e.target.value)}
          className={monoArea}
          placeholder={'507f1f77bcf86cd799439011\nObjectId("...") or {"$oid": "..."} work too'}
        />
        {rows.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="text-muted-foreground text-xs">
                <tr className="border-border border-b">
                  <th className="py-2 pr-4 font-normal">ObjectId</th>
                  <th className="py-2 pr-4 font-normal">Created (UTC)</th>
                  <th className="py-2 pr-4 font-normal">Your time zone</th>
                  <th className="py-2 pr-4 font-normal">Unix seconds</th>
                  <th className="py-2 pr-4 font-normal">Random (5 bytes)</th>
                  <th className="py-2 font-normal">Counter</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) =>
                  r.result ? (
                    <tr key={r.line} className="border-border border-b last:border-0">
                      <td className="py-2.5 pr-4 font-mono">
                        <span className="text-primary">{r.result.hex.slice(0, 8)}</span>
                        <span className="text-brand-sky">{r.result.random}</span>
                        <span className="text-brand-violet">{r.result.hex.slice(18)}</span>
                      </td>
                      <td className="py-2.5 pr-4 font-mono whitespace-nowrap">{r.result.date.toISOString().replace(".000Z", "Z")}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        {/* Time zone and "now" differ between the server render and the browser. */}
                        <span suppressHydrationWarning>{r.result.date.toLocaleString()}</span>{" "}
                        <span className="text-muted-foreground text-xs" suppressHydrationWarning>
                          ({relative(r.result.date)})
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 font-mono">{r.result.seconds}</td>
                      <td className="py-2.5 pr-4 font-mono">{r.result.random}</td>
                      <td className="py-2.5 font-mono">{r.result.counter.toLocaleString("en-US")}</td>
                    </tr>
                  ) : (
                    <tr key={r.line} className="border-border border-b last:border-0">
                      <td colSpan={6} className="text-destructive py-2.5 text-sm">
                        Line {r.line}: {r.error} <span className="text-muted-foreground font-mono">({r.input.slice(0, 60)})</span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <p className="text-muted-foreground mt-3 text-xs">
              <span className="text-primary">Timestamp</span> · <span className="text-brand-sky">random value</span> ·{" "}
              <span className="text-brand-violet">counter</span>
            </p>
          </div>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Generate ObjectIds" actions={generated.length > 0 && <CopyText value={generated.join("\n")} label="Copy all" />}>
          <div className="grid gap-3 sm:grid-cols-[1fr_7rem_auto] sm:items-end">
            <div className="grid gap-1.5">
              <Label htmlFor="oid-date" className="text-muted-foreground text-xs font-normal">
                Date and time (empty = now, your time zone)
              </Label>
              <Input id="oid-date" type="datetime-local" step={1} value={genDate} onChange={(e) => setGenDate(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="oid-count" className="text-muted-foreground text-xs font-normal">
                How many
              </Label>
              <Input id="oid-count" type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
            <Button type="button" onClick={generate}>
              <RefreshCw /> Generate
            </Button>
          </div>
          {genError && <ErrorText>{genError}</ErrorText>}
          {generated.length > 0 && <CodeBlock className="mt-4 max-h-72" value={generated.join("\n")} />}
          <p className="text-muted-foreground mt-3 text-xs">
            Like a driver, each batch uses one random process value and a counter that starts at a random number.
          </p>
        </Panel>

        <Panel title="Query by creation time" actions={range && "query" in range && range.query ? <CopyText value={range.query} /> : null}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="oid-from" className="text-muted-foreground text-xs font-normal">
                From (inclusive)
              </Label>
              <Input id="oid-from" type="datetime-local" step={1} value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="oid-to" className="text-muted-foreground text-xs font-normal">
                To (exclusive)
              </Label>
              <Input id="oid-to" type="datetime-local" step={1} value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          {range && "error" in range && range.error && <ErrorText>{range.error}</ErrorText>}
          {range && "query" in range && range.query && <CodeBlock className="mt-4" value={range.query} wrap />}
          <p className="text-muted-foreground mt-3 text-xs">
            Boundary ids have zero random and counter bytes, so <code>$gte</code> includes every id created in that second. Works with the
            default <code>_id</code> index, no extra index needed.
          </p>
        </Panel>
      </div>
    </div>
  );
}
