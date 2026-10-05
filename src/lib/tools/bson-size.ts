/**
 * Exact BSON byte size of a document, computed from the BSON spec (https://bsonspec.org/spec.html)
 * without serialising anything. Works on the typed value tree produced by ./ejson.
 */
import type { BDoc, BValue } from "./ejson";

/** MongoDB's maximum BSON document size: 16 MiB (https://www.mongodb.com/docs/manual/reference/limits/). */
export const BSON_MAX_SIZE = 16 * 1024 * 1024;

const encoder = new TextEncoder();
export const utf8Length = (s: string) => encoder.encode(s).length;

function b64Length(b64: string): number {
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return (b64.length / 4) * 3 - pad;
}

/** int32 length + UTF-8 bytes + trailing NUL. */
const stringSize = (s: string) => 4 + utf8Length(s) + 1;
/** UTF-8 bytes + trailing NUL. */
const cstringSize = (s: string) => utf8Length(s) + 1;

/** Size of a value's payload (not counting its type byte and key). */
export function valueSize(v: BValue): number {
  switch (v.t) {
    case "double":
    case "int64":
    case "date":
    case "timestamp":
      return 8;
    case "int32":
      return 4;
    case "decimal":
      return 16;
    case "objectId":
      return 12;
    case "bool":
      return 1;
    case "null":
    case "undefined":
    case "minKey":
    case "maxKey":
      return 0;
    case "string":
    case "symbol":
      return stringSize(v.v);
    case "regex":
      return cstringSize(v.pattern) + cstringSize(v.flags);
    case "binary": {
      const n = b64Length(v.base64);
      // Subtype 2 (old binary) repeats the length inside the payload.
      return 4 + 1 + n + (v.subType === 2 ? 4 : 0);
    }
    case "code":
      return v.scope ? 4 + stringSize(v.code) + documentSize(v.scope) : stringSize(v.code);
    case "doc":
      return documentSize(v);
    case "array":
      return arraySize(v.items);
  }
}

/** Size of one element: type byte + key cstring + payload. */
export function elementSize(key: string, v: BValue): number {
  return 1 + cstringSize(key) + valueSize(v);
}

export function documentSize(d: BDoc): number {
  let n = 4 + 1; // int32 length prefix + trailing NUL
  for (const [k, v] of d.entries) n += elementSize(k, v);
  return n;
}

function arraySize(items: BValue[]): number {
  let n = 4 + 1;
  items.forEach((v, i) => (n += elementSize(String(i), v)));
  return n;
}

export type FieldSize = {
  /** Dotted path, e.g. "address.lines.0". */
  path: string;
  /** Bytes taken by this element: type byte + key + value (including everything nested in it). */
  bytes: number;
  type: BValue["t"];
  depth: number;
};

/** Every element in the document, with its size, in document order. */
export function fieldSizes(d: BDoc, maxDepth = 32): FieldSize[] {
  const out: FieldSize[] = [];
  const walk = (entries: [string, BValue][], prefix: string, depth: number) => {
    for (const [k, v] of entries) {
      const path = prefix ? `${prefix}.${k}` : k;
      out.push({ path, bytes: elementSize(k, v), type: v.t, depth });
      if (depth >= maxDepth) continue;
      if (v.t === "doc") walk(v.entries, path, depth + 1);
      else if (v.t === "array")
        walk(
          v.items.map((x, i) => [String(i), x] as [string, BValue]),
          path,
          depth + 1,
        );
    }
  };
  walk(d.entries, "", 0);
  return out;
}

export type SizeReport = {
  bytes: number;
  /** Fraction of the 16 MiB limit, 0..1+ */
  ratio: number;
  overLimit: boolean;
  fieldCount: number;
  maxDepth: number;
  /** Top-level fields, biggest first. */
  topLevel: FieldSize[];
  /** Largest elements at any depth, biggest first. */
  largest: FieldSize[];
};

export function analyzeSize(d: BDoc, top = 10): SizeReport {
  const bytes = documentSize(d);
  const all = fieldSizes(d);
  return {
    bytes,
    ratio: bytes / BSON_MAX_SIZE,
    overLimit: bytes > BSON_MAX_SIZE,
    fieldCount: all.length,
    maxDepth: all.reduce((m, f) => Math.max(m, f.depth + 1), 0),
    topLevel: all.filter((f) => f.depth === 0).sort((a, b) => b.bytes - a.bytes),
    largest: [...all].sort((a, b) => b.bytes - a.bytes || a.depth - b.depth).slice(0, top),
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10240 ? 2 : 1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
