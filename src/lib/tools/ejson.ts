/**
 * A small, dependency-free MongoDB Extended JSON (v2) reader and writer.
 *
 * It reads canonical EJSON, relaxed EJSON, plain JSON and mongosh / legacy shell syntax
 * (ObjectId("..."), ISODate("..."), NumberLong(1), unquoted keys, single quotes, /regex/i,
 * comments, trailing commas) into a typed BSON value tree, and writes that tree back out in
 * any of the three formats. Spec: https://github.com/mongodb/specifications/blob/master/source/extended-json/extended-json.md
 *
 * Everything runs locally; nothing here touches the network.
 */

export type BDoc = { t: "doc"; entries: [string, BValue][] };
export type BValue =
  | { t: "double"; v: number }
  | { t: "int32"; v: number }
  | { t: "int64"; v: string }
  | { t: "decimal"; v: string }
  | { t: "string"; v: string }
  | { t: "bool"; v: boolean }
  | { t: "null" }
  | { t: "undefined" }
  | { t: "objectId"; v: string }
  | { t: "date"; v: number }
  | { t: "regex"; pattern: string; flags: string }
  | { t: "binary"; base64: string; subType: number }
  | { t: "timestamp"; time: number; inc: number }
  | { t: "minKey" }
  | { t: "maxKey" }
  | { t: "symbol"; v: string }
  | { t: "code"; code: string; scope?: BDoc }
  | BDoc
  | { t: "array"; items: BValue[] };

export type OutputFormat = "canonical" | "relaxed" | "shell";

export class EJsonError extends Error {
  readonly pos?: number;
  constructor(message: string, pos?: number) {
    super(message);
    this.name = "EJsonError";
    this.pos = pos;
  }
}

/* ------------------------------------------------------------------ */
/* Reader: text -> raw syntax tree                                      */
/* ------------------------------------------------------------------ */

type Raw =
  | { k: "obj"; entries: [string, Raw][] }
  | { k: "arr"; items: Raw[] }
  | { k: "str"; v: string }
  | { k: "num"; raw: string }
  | { k: "bool"; v: boolean }
  | { k: "null" }
  | { k: "undef" }
  | { k: "regex"; pattern: string; flags: string }
  | { k: "call"; name: string; args: Raw[] };

function lineCol(src: string, pos: number) {
  const before = src.slice(0, pos);
  const line = before.split("\n").length;
  const col = pos - before.lastIndexOf("\n");
  return `line ${line}, column ${col}`;
}

function readRaw(src: string): Raw {
  let i = 0;
  const fail = (msg: string, at = i): never => {
    throw new EJsonError(`${msg} at ${lineCol(src, at)}`, at);
  };

  const skip = () => {
    for (;;) {
      const c = src[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "﻿") i++;
      else if (c === "/" && src[i + 1] === "/") {
        while (i < src.length && src[i] !== "\n") i++;
      } else if (c === "/" && src[i + 1] === "*") {
        const end = src.indexOf("*/", i + 2);
        if (end < 0) fail("Unclosed comment");
        i = end + 2;
      } else return;
    }
  };

  const readString = (): string => {
    const q = src[i++];
    let out = "";
    for (;;) {
      if (i >= src.length) fail("Unterminated string");
      const c = src[i++];
      if (c === q) return out;
      if (c === "\n") fail("Line break inside a string", i - 1);
      if (c !== "\\") {
        out += c;
        continue;
      }
      const e = src[i++];
      switch (e) {
        case "n":
          out += "\n";
          break;
        case "t":
          out += "\t";
          break;
        case "r":
          out += "\r";
          break;
        case "b":
          out += "\b";
          break;
        case "f":
          out += "\f";
          break;
        case "0":
          out += "\0";
          break;
        case "u": {
          const hex = src.slice(i, i + 4);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) fail("Bad \\u escape", i);
          out += String.fromCharCode(parseInt(hex, 16));
          i += 4;
          break;
        }
        default:
          if (e === undefined) fail("Unterminated string");
          out += e; // \" \' \\ \/ and any other escaped character
      }
    }
  };

  const ident = (): string => {
    const m = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/.exec(src.slice(i, i + 200));
    if (!m) fail(`Unexpected ${src[i] === undefined ? "end of input" : `character "${src[i]}"`}`);
    i += m![0].length;
    return m![0];
  };

  const readValue = (): Raw => {
    skip();
    const c = src[i];
    if (c === undefined) fail("Unexpected end of input");
    if (c === "{") {
      i++;
      const entries: [string, Raw][] = [];
      for (;;) {
        skip();
        if (src[i] === "}") {
          i++;
          return { k: "obj", entries };
        }
        let key: string;
        if (src[i] === '"' || src[i] === "'") key = readString();
        else if (/[0-9]/.test(src[i] ?? "")) {
          const m = /^[0-9]+/.exec(src.slice(i))!;
          key = m[0];
          i += key.length;
        } else key = ident();
        skip();
        if (src[i] !== ":") fail(`Expected ":" after key "${key}"`);
        i++;
        entries.push([key, readValue()]);
        skip();
        if (src[i] === ",") i++;
        else if (src[i] !== "}") fail('Expected "," or "}"');
      }
    }
    if (c === "[") {
      i++;
      const items: Raw[] = [];
      for (;;) {
        skip();
        if (src[i] === "]") {
          i++;
          return { k: "arr", items };
        }
        items.push(readValue());
        skip();
        if (src[i] === ",") i++;
        else if (src[i] !== "]") fail('Expected "," or "]"');
      }
    }
    if (c === '"' || c === "'") return { k: "str", v: readString() };
    if (c === "/") {
      const start = i++;
      let pattern = "";
      let inClass = false;
      for (;;) {
        const ch = src[i++];
        if (ch === undefined || ch === "\n") fail("Unterminated regular expression", start);
        if (ch === "\\") {
          pattern += ch + (src[i++] ?? "");
          continue;
        }
        if (ch === "[") inClass = true;
        else if (ch === "]") inClass = false;
        else if (ch === "/" && !inClass) break;
        pattern += ch;
      }
      const flags = /^[a-z]*/.exec(src.slice(i))![0];
      i += flags.length;
      return { k: "regex", pattern, flags };
    }
    const num = /^[-+]?(?:\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?)/.exec(src.slice(i, i + 400));
    if (num) {
      i += num[0].length;
      return { k: "num", raw: num[0].replace(/^\+/, "") };
    }
    if (c === "-" && src.startsWith("-Infinity", i)) {
      i += 9;
      return { k: "num", raw: "-Infinity" };
    }
    const start = i;
    let name = ident();
    if (name === "new") {
      skip();
      name = ident();
    }
    skip();
    if (src[i] === "(") {
      i++;
      const args: Raw[] = [];
      for (;;) {
        skip();
        if (src[i] === ")") {
          i++;
          return { k: "call", name, args };
        }
        args.push(readValue());
        skip();
        if (src[i] === ",") i++;
        else if (src[i] !== ")") fail(`Expected "," or ")" in ${name}(...)`);
      }
    }
    switch (name) {
      case "true":
        return { k: "bool", v: true };
      case "false":
        return { k: "bool", v: false };
      case "null":
        return { k: "null" };
      case "undefined":
        return { k: "undef" };
      case "NaN":
      case "Infinity":
        return { k: "num", raw: name };
      case "MinKey":
      case "MaxKey":
        return { k: "call", name, args: [] };
    }
    return fail(`Unknown value "${name}"`, start);
  };

  const v = readValue();
  skip();
  if (i < src.length) fail("Unexpected text after the value");
  return v;
}

/* ------------------------------------------------------------------ */
/* Raw tree -> typed BSON values                                        */
/* ------------------------------------------------------------------ */

const INT32_MIN = -2147483648;
const INT32_MAX = 2147483647;
const INT64_MIN = BigInt("-9223372036854775808");
const INT64_MAX = BigInt("9223372036854775807");

function toInt64String(x: string | number, what: string): string {
  const s = String(x).trim();
  if (!/^-?\d+$/.test(s)) throw new EJsonError(`${what} needs a whole number, got "${s}"`);
  const b = BigInt(s);
  if (b < INT64_MIN || b > INT64_MAX) throw new EJsonError(`${what} is outside the 64-bit integer range`);
  return b.toString();
}

function toInt32(x: number | string, what: string): number {
  const n = Number(x);
  if (!Number.isInteger(n) || n < INT32_MIN || n > INT32_MAX) throw new EJsonError(`${what} needs a 32-bit integer, got "${x}"`);
  return n;
}

function parseDoubleString(s: string): number {
  if (s === "NaN") return NaN;
  if (s === "Infinity" || s === "+Infinity") return Infinity;
  if (s === "-Infinity") return -Infinity;
  const n = Number(s);
  if (s.trim() === "" || Number.isNaN(n)) throw new EJsonError(`"${s}" is not a valid double`);
  return n;
}

const DECIMAL_RE = /^[-+]?(?:(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|NaN|Infinity|Inf)$/i;

function checkDecimal(s: string): string {
  if (!DECIMAL_RE.test(s.trim())) throw new EJsonError(`"${s}" is not a valid Decimal128`);
  return s.trim();
}

function checkHex24(s: string): string {
  if (!/^[0-9a-fA-F]{24}$/.test(s)) throw new EJsonError(`ObjectId needs 24 hex characters, got "${s}"`);
  return s.toLowerCase();
}

function checkBase64(s: string): string {
  const clean = s.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length % 4 !== 0) throw new EJsonError(`"${s.slice(0, 40)}" is not valid base64`);
  return clean;
}

export function hexToBase64(hex: string): string {
  let bin = "";
  for (let k = 0; k < hex.length; k += 2) bin += String.fromCharCode(parseInt(hex.slice(k, k + 2), 16));
  return btoa(bin);
}

export function base64ToHex(b64: string): string {
  const bin = atob(b64);
  let out = "";
  for (let k = 0; k < bin.length; k++) out += bin.charCodeAt(k).toString(16).padStart(2, "0");
  return out;
}

/** Decoded byte length of a base64 string, without decoding it. */
export function base64ByteLength(b64: string): number {
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return (b64.length / 4) * 3 - pad;
}

function uuidToBase64(s: string): string {
  const hex = s.replace(/-/g, "");
  if (!/^[0-9a-fA-F]{32}$/.test(hex)) throw new EJsonError(`"${s}" is not a valid UUID`);
  return hexToBase64(hex);
}

function parseDate(x: string | number): number {
  const ms = typeof x === "number" ? x : Date.parse(x);
  if (!Number.isFinite(ms)) throw new EJsonError(`"${x}" is not a valid date`);
  return ms;
}

function bsonRegexFlags(flags: string): string {
  // BSON stores options sorted; JS-only flags (g, y, d) have no BSON meaning and are dropped.
  return Array.from(new Set(flags.split("").filter((f) => "ilmsux".includes(f))))
    .sort()
    .join("");
}

function randomObjectIdHex(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const ts = Math.floor(Date.now() / 1000);
  bytes[0] = (ts >>> 24) & 0xff;
  bytes[1] = (ts >>> 16) & 0xff;
  bytes[2] = (ts >>> 8) & 0xff;
  bytes[3] = ts & 0xff;
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function scalar(r: Raw | undefined, what: string): string | number {
  if (!r) throw new EJsonError(`${what} is missing an argument`);
  if (r.k === "str") return r.v;
  if (r.k === "num") return Number(r.raw);
  throw new EJsonError(`${what} expects a string or number argument`);
}

function str(r: Raw | undefined, what: string): string {
  if (r?.k !== "str") throw new EJsonError(`${what} must be a string`);
  return r.v;
}

/**
 * Types a bare number literal the way mongosh and the Node.js driver do: whole numbers that fit in
 * 32 bits become int32, everything else (decimals, larger integers) becomes a double. Use
 * NumberLong(...) / {"$numberLong": ...} for 64-bit integers.
 */
function numberFromLiteral(raw: string): BValue {
  if (/^-?\d+$/.test(raw)) {
    const n = Number(raw);
    if (n >= INT32_MIN && n <= INT32_MAX) return { t: "int32", v: n };
    return { t: "double", v: n };
  }
  return { t: "double", v: parseDoubleString(raw) };
}

function objKeys(entries: [string, Raw][]): string {
  return entries
    .map(([k]) => k)
    .sort()
    .join(",");
}

function get(entries: [string, Raw][], key: string): Raw | undefined {
  return entries.find(([k]) => k === key)?.[1];
}

/** Recognises an Extended JSON type wrapper such as {"$oid": "..."}; returns null for an ordinary document. */
function fromWrapper(entries: [string, Raw][]): BValue | null {
  if (entries.length === 0 || entries.length > 2 || !entries[0][0].startsWith("$")) return null;
  const keys = objKeys(entries);
  const one = entries[0][1];
  switch (keys) {
    case "$oid":
      return one.k === "str" ? { t: "objectId", v: checkHex24(one.v) } : null;
    case "$numberInt":
      return one.k === "str" ? { t: "int32", v: toInt32(one.v, "$numberInt") } : null;
    case "$numberLong":
      return one.k === "str" ? { t: "int64", v: toInt64String(one.v, "$numberLong") } : null;
    case "$numberDouble":
      return one.k === "str" ? { t: "double", v: parseDoubleString(one.v) } : null;
    case "$numberDecimal":
      return one.k === "str" ? { t: "decimal", v: checkDecimal(one.v) } : null;
    case "$date": {
      if (one.k === "str") return { t: "date", v: parseDate(one.v) };
      if (one.k === "num") return { t: "date", v: Number(one.raw) };
      if (one.k === "obj" && objKeys(one.entries) === "$numberLong") {
        return { t: "date", v: Number(toInt64String(str(get(one.entries, "$numberLong"), "$numberLong"), "$date")) };
      }
      return null;
    }
    case "$binary": {
      if (one.k !== "obj") return null;
      const b64 = str(get(one.entries, "base64"), "$binary.base64");
      const sub = str(get(one.entries, "subType"), "$binary.subType");
      return { t: "binary", base64: checkBase64(b64), subType: parseInt(sub, 16) };
    }
    case "$binary,$type": {
      // Legacy (v1) form: {"$binary": "<base64>", "$type": "<hex>"}
      const b64 = get(entries, "$binary");
      const type = get(entries, "$type");
      if (b64?.k !== "str" || type?.k !== "str") return null;
      return { t: "binary", base64: checkBase64(b64.v), subType: parseInt(type.v, 16) };
    }
    case "$uuid":
      return one.k === "str" ? { t: "binary", base64: uuidToBase64(one.v), subType: 4 } : null;
    case "$timestamp": {
      if (one.k !== "obj") return null;
      const t = scalar(get(one.entries, "t"), "$timestamp.t");
      const inc = scalar(get(one.entries, "i"), "$timestamp.i");
      return { t: "timestamp", time: Number(t), inc: Number(inc) };
    }
    case "$regularExpression": {
      if (one.k !== "obj") return null;
      return {
        t: "regex",
        pattern: str(get(one.entries, "pattern"), "$regularExpression.pattern"),
        flags: bsonRegexFlags(str(get(one.entries, "options"), "$regularExpression.options")),
      };
    }
    case "$minKey":
      return { t: "minKey" };
    case "$maxKey":
      return { t: "maxKey" };
    case "$undefined":
      return { t: "undefined" };
    case "$symbol":
      return one.k === "str" ? { t: "symbol", v: one.v } : null;
    case "$code":
      return one.k === "str" ? { t: "code", code: one.v } : null;
    case "$code,$scope": {
      const code = get(entries, "$code");
      const scope = get(entries, "$scope");
      if (code?.k !== "str" || scope?.k !== "obj") return null;
      const s = convert(scope);
      return { t: "code", code: code.v, scope: s as BDoc };
    }
  }
  return null;
}

function fromCall(name: string, args: Raw[]): BValue {
  const short = name.replace(/^(BSON|bson)\./, "");
  switch (short) {
    case "ObjectId":
    case "ObjectID":
      return { t: "objectId", v: args.length ? checkHex24(String(scalar(args[0], name))) : randomObjectIdHex() };
    case "ISODate":
    case "Date":
      if (!args.length) return { t: "date", v: Date.now() };
      return { t: "date", v: parseDate(scalar(args[0], name)) };
    case "NumberLong":
    case "Long":
    case "Int64":
      return { t: "int64", v: toInt64String(scalar(args[0], name), name) };
    case "Long.fromString":
      return { t: "int64", v: toInt64String(str(args[0], name), name) };
    case "NumberInt":
    case "Int32":
      return { t: "int32", v: toInt32(scalar(args[0], name), name) };
    case "NumberDecimal":
    case "Decimal128":
    case "Decimal128.fromString":
      return { t: "decimal", v: checkDecimal(String(scalar(args[0], name))) };
    case "Double":
    case "NumberDouble": {
      const a = args[0];
      if (a?.k === "num") return { t: "double", v: parseDoubleString(a.raw) };
      return { t: "double", v: parseDoubleString(String(scalar(a, name))) };
    }
    case "Timestamp": {
      const a = args[0];
      if (a?.k === "obj") {
        return {
          t: "timestamp",
          time: Number(scalar(get(a.entries, "t"), "Timestamp.t")),
          inc: Number(scalar(get(a.entries, "i"), "Timestamp.i")),
        };
      }
      return {
        t: "timestamp",
        time: Number(scalar(args[0] ?? { k: "num", raw: "0" }, name)),
        inc: Number(scalar(args[1] ?? { k: "num", raw: "0" }, name)),
      };
    }
    case "BinData":
      return { t: "binary", subType: Number(scalar(args[0], name)), base64: checkBase64(str(args[1], "BinData data")) };
    case "Binary.createFromBase64":
    case "Binary":
      return { t: "binary", base64: checkBase64(str(args[0], name)), subType: args[1] ? Number(scalar(args[1], name)) : 0 };
    case "HexData":
    case "Binary.createFromHexString": {
      const sub = short === "HexData" ? Number(scalar(args[0], name)) : args[1] ? Number(scalar(args[1], name)) : 0;
      const hex = str(short === "HexData" ? args[1] : args[0], name).replace(/\s+/g, "");
      if (!/^([0-9a-fA-F]{2})*$/.test(hex)) throw new EJsonError(`${name} needs an even number of hex characters`);
      return { t: "binary", base64: hexToBase64(hex), subType: sub };
    }
    case "UUID": {
      if (!args.length) {
        const b = new Uint8Array(16);
        crypto.getRandomValues(b);
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        return { t: "binary", base64: btoa(String.fromCharCode(...Array.from(b))), subType: 4 };
      }
      return { t: "binary", base64: uuidToBase64(str(args[0], name)), subType: 4 };
    }
    case "MD5":
      return { t: "binary", base64: hexToBase64(str(args[0], name)), subType: 5 };
    case "MinKey":
      return { t: "minKey" };
    case "MaxKey":
      return { t: "maxKey" };
    case "RegExp":
    case "BSONRegExp":
      return { t: "regex", pattern: str(args[0], name), flags: bsonRegexFlags(args[1] ? str(args[1], name) : "") };
    case "BSONSymbol":
    case "Symbol":
      return { t: "symbol", v: str(args[0], name) };
    case "Code": {
      const scope = args[1] ? convert(args[1]) : undefined;
      if (scope && scope.t !== "doc") throw new EJsonError("Code scope must be a document");
      return { t: "code", code: str(args[0], name), scope: scope as BDoc | undefined };
    }
    case "DBRef": {
      const entries: [string, BValue][] = [
        ["$ref", { t: "string", v: str(args[0], name) }],
        ["$id", convert(args[1] ?? { k: "null" })],
      ];
      if (args[2]) entries.push(["$db", { t: "string", v: str(args[2], name) }]);
      return { t: "doc", entries };
    }
  }
  throw new EJsonError(`Unsupported constructor ${name}(...)`);
}

function convert(r: Raw): BValue {
  switch (r.k) {
    case "obj":
      return fromWrapper(r.entries) ?? { t: "doc", entries: r.entries.map(([k, v]) => [k, convert(v)] as [string, BValue]) };
    case "arr":
      return { t: "array", items: r.items.map(convert) };
    case "str":
      return { t: "string", v: r.v };
    case "num":
      return numberFromLiteral(r.raw);
    case "bool":
      return { t: "bool", v: r.v };
    case "null":
      return { t: "null" };
    case "undef":
      return { t: "undefined" };
    case "regex":
      return { t: "regex", pattern: r.pattern, flags: bsonRegexFlags(r.flags) };
    case "call":
      return fromCall(r.name, r.args);
  }
}

/** Parses Extended JSON (canonical or relaxed), plain JSON, or shell syntax into a typed BSON value. */
export function parseEJson(text: string): BValue {
  if (!text.trim()) throw new EJsonError("Input is empty");
  return convert(readRaw(text));
}

/* ------------------------------------------------------------------ */
/* Writer                                                               */
/* ------------------------------------------------------------------ */

function doubleCanonical(n: number): string {
  if (Number.isNaN(n)) return "NaN";
  if (n === Infinity) return "Infinity";
  if (n === -Infinity) return "-Infinity";
  if (Object.is(n, -0)) return "-0.0";
  if (Number.isInteger(n) && Math.abs(n) < 1e21) return n.toFixed(1);
  return String(n);
}

function isoInRange(ms: number): boolean {
  const y = new Date(ms).getUTCFullYear();
  return y >= 1970 && y <= 9999;
}

function quoteShell(s: string): string {
  return "'" + JSON.stringify(s).slice(1, -1).replace(/\\"/g, '"').replace(/'/g, "\\'") + "'";
}

/** Escapes unescaped forward slashes so a pattern can sit inside a /regex/ literal. */
function escapeSlashes(p: string): string {
  let out = "";
  for (let k = 0; k < p.length; k++) {
    if (p[k] === "\\") {
      out += p[k] + (p[k + 1] ?? "");
      k++;
    } else out += p[k] === "/" ? "\\/" : p[k];
  }
  return out;
}

function hex2(n: number) {
  return n.toString(16).padStart(2, "0");
}

function formatUuid(hex: string) {
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** A leaf rendered as a JSON-ish value (for canonical / relaxed) or a ready-made shell expression. */
type Node = { obj: [string, Node][] } | { arr: Node[] } | { lit: string };

const lit = (s: string): Node => ({ lit: s });
const obj = (entries: [string, Node][]): Node => ({ obj: entries });

function toNode(v: BValue, fmt: OutputFormat): Node {
  const json = fmt !== "shell";
  const relaxed = fmt === "relaxed";
  switch (v.t) {
    case "doc":
      return obj(v.entries.map(([k, x]) => [k, toNode(x, fmt)]));
    case "array":
      return { arr: v.items.map((x) => toNode(x, fmt)) };
    case "string":
      return lit(json ? JSON.stringify(v.v) : quoteShell(v.v));
    case "bool":
      return lit(String(v.v));
    case "null":
      return lit("null");
    case "undefined":
      return json ? obj([["$undefined", lit("true")]]) : lit("undefined");
    case "int32":
      return relaxed || !json ? lit(String(v.v)) : obj([["$numberInt", lit(JSON.stringify(String(v.v)))]]);
    case "int64": {
      if (!json) return lit(`Long(${quoteShell(v.v)})`);
      const n = Number(v.v);
      if (relaxed && Number.isSafeInteger(n)) return lit(v.v);
      return obj([["$numberLong", lit(JSON.stringify(v.v))]]);
    }
    case "double": {
      const finite = Number.isFinite(v.v) && !Object.is(v.v, -0);
      if (!json) {
        if (!Number.isFinite(v.v)) return lit(String(v.v));
        return Number.isInteger(v.v) ? lit(`Double(${doubleCanonical(v.v)})`) : lit(String(v.v));
      }
      // Relaxed keeps a trailing ".0" on whole numbers so the type survives a round trip.
      if (relaxed && finite) return lit(doubleCanonical(v.v));
      return obj([["$numberDouble", lit(JSON.stringify(doubleCanonical(v.v)))]]);
    }
    case "decimal":
      return json ? obj([["$numberDecimal", lit(JSON.stringify(v.v))]]) : lit(`Decimal128(${quoteShell(v.v)})`);
    case "objectId":
      return json ? obj([["$oid", lit(JSON.stringify(v.v))]]) : lit(`ObjectId(${quoteShell(v.v)})`);
    case "date": {
      const iso = isoInRange(v.v) ? new Date(v.v).toISOString() : null;
      if (!json) return iso ? lit(`ISODate(${quoteShell(iso)})`) : lit(`new Date(${v.v})`);
      if (relaxed && iso) return obj([["$date", lit(JSON.stringify(iso))]]);
      return obj([["$date", obj([["$numberLong", lit(JSON.stringify(String(v.v)))]])]]);
    }
    case "regex": {
      if (!json) {
        const jsOk = !/[lx]/.test(v.flags) && v.pattern !== "";
        if (jsOk) return lit(`/${escapeSlashes(v.pattern)}/${v.flags}`);
        return lit(`BSONRegExp(${quoteShell(v.pattern)}, ${quoteShell(v.flags)})`);
      }
      return obj([
        [
          "$regularExpression",
          obj([
            ["pattern", lit(JSON.stringify(v.pattern))],
            ["options", lit(JSON.stringify(v.flags))],
          ]),
        ],
      ]);
    }
    case "binary": {
      if (!json) {
        if (v.subType === 4 && base64ByteLength(v.base64) === 16) return lit(`UUID(${quoteShell(formatUuid(base64ToHex(v.base64)))})`);
        return lit(`Binary.createFromBase64(${quoteShell(v.base64)}, ${v.subType})`);
      }
      return obj([
        [
          "$binary",
          obj([
            ["base64", lit(JSON.stringify(v.base64))],
            ["subType", lit(JSON.stringify(hex2(v.subType)))],
          ]),
        ],
      ]);
    }
    case "timestamp":
      return json
        ? obj([
            [
              "$timestamp",
              obj([
                ["t", lit(String(v.time))],
                ["i", lit(String(v.inc))],
              ]),
            ],
          ])
        : lit(`Timestamp({ t: ${v.time}, i: ${v.inc} })`);
    case "minKey":
      return json ? obj([["$minKey", lit("1")]]) : lit("MinKey()");
    case "maxKey":
      return json ? obj([["$maxKey", lit("1")]]) : lit("MaxKey()");
    case "symbol":
      return json ? obj([["$symbol", lit(JSON.stringify(v.v))]]) : lit(`BSONSymbol(${quoteShell(v.v)})`);
    case "code": {
      if (!json)
        return lit(v.scope ? `Code(${quoteShell(v.code)}, ${render(toNode(v.scope, fmt), fmt, "")})` : `Code(${quoteShell(v.code)})`);
      const e: [string, Node][] = [["$code", lit(JSON.stringify(v.code))]];
      if (v.scope) e.push(["$scope", toNode(v.scope, fmt)]);
      return obj(e);
    }
  }
}

function renderKey(k: string, fmt: OutputFormat) {
  if (fmt === "shell" && /^[A-Za-z_$][\w$]*$/.test(k)) return k;
  return fmt === "shell" ? quoteShell(k) : JSON.stringify(k);
}

function render(n: Node, fmt: OutputFormat, indent: string, step = "  "): string {
  if ("lit" in n) return n.lit;
  const inner = indent + step;
  if ("arr" in n) {
    if (!n.arr.length) return "[]";
    return `[\n${n.arr.map((x) => inner + render(x, fmt, inner, step)).join(",\n")}\n${indent}]`;
  }
  if (!n.obj.length) return "{}";
  // Keep small type wrappers like {"$oid": "..."} on one line for readability.
  const compact =
    n.obj.length <= 2 && n.obj.every(([k, x]) => k.startsWith("$") && ("lit" in x || ("obj" in x && x.obj.every(([, y]) => "lit" in y))));
  if (compact) {
    return `{ ${n.obj.map(([k, x]) => `${renderKey(k, fmt)}: ${render(x, fmt, "", "")}`.replace(/\n/g, " ")).join(", ")} }`.replace(
      /\{ \}/g,
      "{}",
    );
  }
  return `{\n${n.obj.map(([k, x]) => `${inner}${renderKey(k, fmt)}: ${render(x, fmt, inner, step)}`).join(",\n")}\n${indent}}`;
}

/** Writes a BSON value as canonical EJSON, relaxed EJSON or mongosh shell syntax. */
export function stringifyEJson(v: BValue, fmt: OutputFormat, opts: { indent?: number } = {}): string {
  const step = " ".repeat(opts.indent ?? 2);
  const out = render(toNode(v, fmt), fmt, "", step);
  if (!step) return out.replace(/\n\s*/g, "");
  return out;
}

/** Converts a BSON value into plain JavaScript (numbers, strings, nested objects). Useful for analysing explain output. */
export function toPlain(v: BValue): unknown {
  switch (v.t) {
    case "doc": {
      const o: Record<string, unknown> = {};
      for (const [k, x] of v.entries) o[k] = toPlain(x);
      return o;
    }
    case "array":
      return v.items.map(toPlain);
    case "int32":
    case "double":
    case "string":
    case "bool":
    case "symbol":
      return v.v;
    case "int64":
    case "decimal":
      return Number(v.v);
    case "null":
    case "undefined":
    case "minKey":
    case "maxKey":
      return null;
    case "objectId":
      return v.v;
    case "date":
      return new Date(v.v).toISOString();
    case "regex":
      return `/${v.pattern}/${v.flags}`;
    case "binary":
      return v.base64;
    case "timestamp":
      return { t: v.time, i: v.inc };
    case "code":
      return v.code;
  }
}

/** Human-readable BSON type name, as $type reports it. */
export function bsonTypeName(v: BValue): string {
  const names: Record<BValue["t"], string> = {
    double: "double",
    int32: "int",
    int64: "long",
    decimal: "decimal",
    string: "string",
    bool: "bool",
    null: "null",
    undefined: "undefined",
    objectId: "objectId",
    date: "date",
    regex: "regex",
    binary: "binData",
    timestamp: "timestamp",
    minKey: "minKey",
    maxKey: "maxKey",
    symbol: "symbol",
    code: "javascript",
    doc: "object",
    array: "array",
  };
  return v.t === "code" && v.scope ? "javascriptWithScope" : names[v.t];
}
