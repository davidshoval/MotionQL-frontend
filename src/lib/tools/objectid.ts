/**
 * ObjectId helpers. Layout (https://www.mongodb.com/docs/manual/reference/method/ObjectId/):
 *   4-byte timestamp (seconds since the Unix epoch, big-endian)
 *   5-byte random value, unique to the machine and process
 *   3-byte incrementing counter (big-endian), started at a random value
 */

export type DecodedObjectId = {
  hex: string;
  /** Seconds since the Unix epoch. */
  seconds: number;
  date: Date;
  /** 5-byte process-unique random value, as hex. */
  random: string;
  /** 3-byte counter as a number. */
  counter: number;
};

export const OBJECTID_RE = /^[0-9a-f]{24}$/i;

export function isObjectIdHex(s: string): boolean {
  return OBJECTID_RE.test(s);
}

/** Pulls a 24-hex ObjectId out of input such as `ObjectId("...")`, `{"$oid": "..."}` or a bare hex string. */
export function extractObjectIdHex(input: string): string | null {
  const m = /(?:^|[^0-9a-f])([0-9a-f]{24})(?![0-9a-f])/i.exec(input.trim());
  return m ? m[1].toLowerCase() : null;
}

export function decodeObjectId(input: string): DecodedObjectId {
  const hex = extractObjectIdHex(input);
  if (!hex) throw new Error("Not an ObjectId: expected 24 hexadecimal characters");
  const seconds = parseInt(hex.slice(0, 8), 16);
  return {
    hex,
    seconds,
    date: new Date(seconds * 1000),
    random: hex.slice(8, 18),
    counter: parseInt(hex.slice(18, 24), 16),
  };
}

export type BatchLine = { line: number; input: string; result?: DecodedObjectId; error?: string };

/** Decodes one ObjectId per non-empty line. */
export function decodeMany(text: string): BatchLine[] {
  return text
    .split(/\r?\n/)
    .map((input, i) => ({ input: input.trim(), line: i + 1 }))
    .filter((l) => l.input)
    .map(({ input, line }) => {
      try {
        return { line, input, result: decodeObjectId(input) };
      } catch (e) {
        return { line, input, error: (e as Error).message };
      }
    });
}

const hexBytes = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

function randomBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

function timestampHex(date: Date): string {
  const secs = Math.floor(date.getTime() / 1000);
  if (!Number.isFinite(secs) || secs < 0 || secs > 0xffffffff) {
    throw new Error("Date must be between 1970-01-01 and 2106-02-07 to fit in an ObjectId");
  }
  return secs.toString(16).padStart(8, "0");
}

/**
 * Generates ObjectIds like a driver does: one random process value and a counter that starts at a
 * random number and increments for each id.
 */
export function generateObjectIds(count: number, date: Date = new Date()): string[] {
  const ts = timestampHex(date);
  const processValue = hexBytes(randomBytes(5));
  const c = randomBytes(3);
  let counter = (c[0] << 16) | (c[1] << 8) | c[2];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(ts + processValue + counter.toString(16).padStart(6, "0"));
    counter = (counter + 1) & 0xffffff;
  }
  return out;
}

/**
 * The smallest ObjectId for a given second (random and counter bytes are zero). Use it to query
 * by creation time: `{ _id: { $gte: ObjectId("<this>") } }`.
 */
export function objectIdForDate(date: Date): string {
  return timestampHex(date) + "0".repeat(16);
}
