/**
 * MongoDB connection string parser and builder, following the Connection String spec:
 * https://github.com/mongodb/specifications/blob/master/source/connection-string/connection-string-spec.md
 * and the options reference: https://www.mongodb.com/docs/manual/reference/connection-string-options/
 *
 * Pure functions, no network. SRV records are not resolved (that would need DNS).
 */

export type Scheme = "mongodb" | "mongodb+srv";
export type HostPort = { host: string; port?: number };
export type ConnOption = { key: string; value: string };

export type ConnParts = {
  scheme: Scheme;
  username?: string;
  password?: string;
  hosts: HostPort[];
  /** The path segment: default database, also the default authSource. */
  database?: string;
  options: ConnOption[];
};

export type Issue = { level: "error" | "warning" | "info"; message: string };
export type ParseResult = { parts: ConnParts; issues: Issue[] } | { parts: null; issues: Issue[] };

type OptType = "bool" | "int" | "string" | "enum";
export type OptionSpec = { name: string; type: OptType; values?: string[]; description: string; deprecated?: string };

export const AUTH_MECHANISMS = ["SCRAM-SHA-256", "SCRAM-SHA-1", "MONGODB-X509", "MONGODB-AWS", "MONGODB-OIDC", "GSSAPI", "PLAIN"];
export const READ_PREFERENCES = ["primary", "primaryPreferred", "secondary", "secondaryPreferred", "nearest"];

export const OPTION_SPECS: OptionSpec[] = [
  {
    name: "authSource",
    type: "string",
    description: "Database that holds the user's credentials. Defaults to the path database, or admin.",
  },
  {
    name: "authMechanism",
    type: "enum",
    values: AUTH_MECHANISMS,
    description: "Authentication mechanism. Drivers negotiate SCRAM if omitted.",
  },
  {
    name: "authMechanismProperties",
    type: "string",
    description: "Comma-separated key:value pairs, e.g. SERVICE_NAME:mongodb or ENVIRONMENT:azure.",
  },
  { name: "replicaSet", type: "string", description: "Name of the replica set to connect to." },
  { name: "directConnection", type: "bool", description: "Connect only to the given host, without discovering the rest of the topology." },
  { name: "loadBalanced", type: "bool", description: "Connect through a load balancer (for example Atlas serverless or a proxy)." },
  { name: "tls", type: "bool", description: "Use TLS. On by default for mongodb+srv." },
  { name: "ssl", type: "bool", description: "Old alias of tls.", deprecated: "Use tls instead." },
  { name: "tlsCAFile", type: "string", description: "Path to a PEM file with the certificate authorities to trust." },
  { name: "tlsCertificateKeyFile", type: "string", description: "Path to the client certificate and key PEM file (X.509 auth)." },
  { name: "tlsCertificateKeyFilePassword", type: "string", description: "Password for an encrypted client key file." },
  { name: "tlsAllowInvalidCertificates", type: "bool", description: "Skip certificate validation. Insecure; for testing only." },
  {
    name: "tlsAllowInvalidHostnames",
    type: "bool",
    description: "Skip hostname checks against the certificate. Insecure; for testing only.",
  },
  { name: "tlsInsecure", type: "bool", description: "Disable all TLS validation. Insecure; for testing only." },
  { name: "retryWrites", type: "bool", description: "Retry certain writes once after a network error. On by default in modern drivers." },
  { name: "retryReads", type: "bool", description: "Retry certain reads once after a network error. On by default." },
  { name: "w", type: "string", description: "Write concern: a number of nodes, majority, or a tag set name." },
  { name: "journal", type: "bool", description: "Require writes to be written to the on-disk journal before acknowledging." },
  { name: "wtimeoutMS", type: "int", description: "Time limit for the write concern, in milliseconds." },
  { name: "readPreference", type: "enum", values: READ_PREFERENCES, description: "Which members to read from." },
  { name: "readPreferenceTags", type: "string", description: "Tag set for read preference, e.g. dc:ny,rack:1. May repeat." },
  { name: "maxStalenessSeconds", type: "int", description: "How stale a secondary may be before it is not read from (90 or more, or -1)." },
  {
    name: "readConcernLevel",
    type: "enum",
    values: ["local", "majority", "linearizable", "available", "snapshot"],
    description: "Read concern level.",
  },
  { name: "appName", type: "string", description: "Name shown in server logs, currentOp and profiler output." },
  { name: "maxPoolSize", type: "int", description: "Maximum connections in the pool (default 100)." },
  { name: "minPoolSize", type: "int", description: "Minimum connections kept in the pool (default 0)." },
  { name: "maxIdleTimeMS", type: "int", description: "How long a pooled connection may sit idle before it is closed." },
  { name: "maxConnecting", type: "int", description: "Maximum connections a pool may be establishing at once (default 2)." },
  { name: "waitQueueTimeoutMS", type: "int", description: "How long to wait for a free connection from the pool." },
  { name: "connectTimeoutMS", type: "int", description: "Time limit for opening a connection (default 30000)." },
  { name: "socketTimeoutMS", type: "int", description: "Time limit for a send or receive on a socket (0 = none)." },
  { name: "serverSelectionTimeoutMS", type: "int", description: "How long to look for a suitable server before failing (default 30000)." },
  { name: "heartbeatFrequencyMS", type: "int", description: "How often to check each server's state (default 10000)." },
  { name: "localThresholdMS", type: "int", description: "Latency window for picking among eligible servers (default 15)." },
  { name: "timeoutMS", type: "int", description: "Client-side operation timeout covering the whole operation." },
  { name: "compressors", type: "string", description: "Comma-separated wire compressors: snappy, zlib, zstd." },
  { name: "zlibCompressionLevel", type: "int", description: "zlib level from -1 to 9." },
  { name: "srvMaxHosts", type: "int", description: "Limit how many SRV hosts to connect to (mongodb+srv only)." },
  { name: "srvServiceName", type: "string", description: "SRV service name to look up (default mongodb; mongodb+srv only)." },
  {
    name: "uuidRepresentation",
    type: "enum",
    values: ["standard", "csharpLegacy", "javaLegacy", "pythonLegacy"],
    description: "How drivers encode UUIDs.",
  },
  { name: "proxyHost", type: "string", description: "SOCKS5 proxy host." },
  { name: "proxyPort", type: "int", description: "SOCKS5 proxy port (default 1080)." },
  { name: "proxyUsername", type: "string", description: "SOCKS5 proxy username." },
  { name: "proxyPassword", type: "string", description: "SOCKS5 proxy password." },
  { name: "wtimeout", type: "int", description: "Old alias of wtimeoutMS.", deprecated: "Use wtimeoutMS instead." },
  { name: "j", type: "bool", description: "Old alias of journal.", deprecated: "Use journal instead." },
];

const SPEC_BY_LOWER = new Map(OPTION_SPECS.map((s) => [s.name.toLowerCase(), s]));

export function findOptionSpec(key: string): OptionSpec | undefined {
  return SPEC_BY_LOWER.get(key.toLowerCase());
}

function decode(s: string, what: string, issues: Issue[]): string {
  try {
    return decodeURIComponent(s);
  } catch {
    issues.push({ level: "error", message: `${what} has an invalid percent-encoding sequence.` });
    return s;
  }
}

function parseHost(raw: string, issues: Issue[]): HostPort | null {
  if (!raw) {
    issues.push({ level: "error", message: "Empty host in the host list." });
    return null;
  }
  let host = raw;
  let portStr: string | undefined;
  if (raw.startsWith("[")) {
    const end = raw.indexOf("]");
    if (end < 0) {
      issues.push({ level: "error", message: `IPv6 address "${raw}" is missing a closing bracket.` });
      return null;
    }
    host = raw.slice(0, end + 1);
    const rest = raw.slice(end + 1);
    if (rest) {
      if (!rest.startsWith(":")) {
        issues.push({ level: "error", message: `Unexpected text after IPv6 address in "${raw}".` });
        return null;
      }
      portStr = rest.slice(1);
    }
  } else {
    const colons = raw.split(":").length - 1;
    if (colons > 1) {
      issues.push({ level: "error", message: `"${raw}" looks like an IPv6 address; wrap it in [brackets].` });
      return null;
    }
    if (colons === 1) [host, portStr] = raw.split(":");
  }
  host = decode(host, "A host", issues);
  if (portStr === undefined) return { host };
  if (!/^\d+$/.test(portStr) || +portStr < 1 || +portStr > 65535) {
    issues.push({ level: "error", message: `Port "${portStr}" on ${host} must be a number from 1 to 65535.` });
    return { host };
  }
  return { host, port: +portStr };
}

const UNSAFE_USERINFO = /[:/?#[\]@]/;

export function parseConnectionString(input: string): ParseResult {
  const issues: Issue[] = [];
  const uri = input.trim();
  const m = /^(mongodb(?:\+srv)?):\/\//i.exec(uri);
  if (!m) {
    return { parts: null, issues: [{ level: "error", message: 'A connection string must start with "mongodb://" or "mongodb+srv://".' }] };
  }
  const scheme = m[1].toLowerCase() as Scheme;
  let rest = uri.slice(m[0].length);

  // Userinfo ends at the right-most "@" before the path; the path starts at the first "/" after that.
  let userinfo: string | undefined;
  const firstSlash = rest.indexOf("/");
  const searchEnd = firstSlash < 0 ? rest.length : firstSlash;
  let at = rest.lastIndexOf("@", searchEnd);
  // A "/" inside an unescaped password would hide the "@"; look past it so we can explain the problem.
  if (at < 0 && rest.indexOf("@") > searchEnd) at = rest.lastIndexOf("@", rest.search(/[?]/) < 0 ? rest.length : rest.search(/[?]/));
  if (at >= 0) {
    userinfo = rest.slice(0, at);
    rest = rest.slice(at + 1);
  }

  let hostPart = rest;
  let path: string | undefined;
  let query: string | undefined;
  const slash = rest.indexOf("/");
  const q = rest.indexOf("?");
  if (slash >= 0 && (q < 0 || slash < q)) {
    hostPart = rest.slice(0, slash);
    const after = rest.slice(slash + 1);
    const q2 = after.indexOf("?");
    path = q2 >= 0 ? after.slice(0, q2) : after;
    query = q2 >= 0 ? after.slice(q2 + 1) : undefined;
  } else if (q >= 0) {
    hostPart = rest.slice(0, q);
    query = rest.slice(q + 1);
    issues.push({ level: "info", message: 'Add a "/" before "?" (e.g. host/?option=value); some drivers require it.' });
  }

  let username: string | undefined;
  let password: string | undefined;
  if (userinfo !== undefined) {
    const colon = userinfo.indexOf(":");
    const rawUser = colon >= 0 ? userinfo.slice(0, colon) : userinfo;
    const rawPass = colon >= 0 ? userinfo.slice(colon + 1) : undefined;
    if (UNSAFE_USERINFO.test(rawUser) || (rawPass !== undefined && UNSAFE_USERINFO.test(rawPass))) {
      issues.push({
        level: "error",
        message: "The username or password contains a reserved character (: / ? # [ ] @). Percent-encode it, e.g. @ as %40.",
      });
    }
    username = decode(rawUser, "The username", issues);
    if (rawPass !== undefined) password = decode(rawPass, "The password", issues);
    if (!username) issues.push({ level: "error", message: "A password is given without a username." });
  }

  const hosts: HostPort[] = [];
  if (!hostPart) issues.push({ level: "error", message: "No host given." });
  else
    for (const h of hostPart.split(",")) {
      const hp = parseHost(h, issues);
      if (hp) hosts.push(hp);
    }

  let database: string | undefined;
  if (path) {
    database = decode(path, "The database name", issues);
    if (/[/\\. "$]/.test(database)) issues.push({ level: "error", message: `"${database}" is not a valid database name.` });
  }

  const options: ConnOption[] = [];
  if (query) {
    if (query.includes(";") && !query.includes("&"))
      issues.push({ level: "warning", message: 'Separate options with "&"; ";" is a legacy separator.' });
    for (const pair of query.split(/[&;]/)) {
      if (!pair) continue;
      const eq = pair.indexOf("=");
      if (eq < 0) {
        issues.push({ level: "error", message: `Option "${pair}" has no value.` });
        continue;
      }
      const rawKey = decode(pair.slice(0, eq), "An option name", issues);
      const value = decode(pair.slice(eq + 1), `Option ${rawKey}`, issues);
      const spec = findOptionSpec(rawKey);
      options.push({ key: spec ? spec.name : rawKey, value });
    }
  }

  const parts: ConnParts = { scheme, username, password, hosts, database, options };
  issues.push(...validate(parts));
  return { parts, issues };
}

function optValue(parts: ConnParts, key: string): string | undefined {
  const lower = key.toLowerCase();
  for (let k = parts.options.length - 1; k >= 0; k--) if (parts.options[k].key.toLowerCase() === lower) return parts.options[k].value;
  return undefined;
}

/** Checks a set of parts for the mistakes drivers reject or that commonly cause connection failures. */
export function validate(parts: ConnParts): Issue[] {
  const issues: Issue[] = [];
  const err = (message: string) => issues.push({ level: "error", message });
  const warn = (message: string) => issues.push({ level: "warning", message });
  const info = (message: string) => issues.push({ level: "info", message });
  const srv = parts.scheme === "mongodb+srv";

  if (srv) {
    if (parts.hosts.length !== 1) err("mongodb+srv:// takes exactly one host name (the SRV record), not a host list.");
    if (parts.hosts.some((h) => h.port !== undefined)) err("mongodb+srv:// host names cannot have a port.");
    const h = parts.hosts[0]?.host ?? "";
    if (h && h.split(".").length < 2) warn(`"${h}" should be a domain name with at least two parts for an SRV lookup.`);
  }

  const seen = new Map<string, number>();
  for (const o of parts.options) {
    const spec = findOptionSpec(o.key);
    seen.set(o.key.toLowerCase(), (seen.get(o.key.toLowerCase()) ?? 0) + 1);
    if (!spec) {
      warn(`Unknown option "${o.key}". Drivers ignore or reject options they do not recognise.`);
      continue;
    }
    if (spec.deprecated) warn(`"${spec.name}" is deprecated. ${spec.deprecated}`);
    if (spec.type === "bool" && !/^(true|false)$/.test(o.value)) err(`${spec.name} must be true or false, not "${o.value}".`);
    if (spec.type === "int" && !/^-?\d+$/.test(o.value)) err(`${spec.name} must be a whole number, not "${o.value}".`);
    if (spec.type === "enum" && spec.values && !spec.values.includes(o.value)) {
      const fix = spec.values.find((v) => v.toLowerCase() === o.value.toLowerCase());
      err(`${spec.name}="${o.value}" is not valid.${fix ? ` Did you mean "${fix}"?` : ` Use one of: ${spec.values.join(", ")}.`}`);
    }
  }
  for (const [k, n] of seen)
    if (n > 1 && k !== "readpreferencetags") warn(`"${findOptionSpec(k)?.name ?? k}" is set ${n} times; the last value wins.`);

  const tls = optValue(parts, "tls");
  const ssl = optValue(parts, "ssl");
  if (tls && ssl && tls !== ssl) err("tls and ssl are set to different values.");
  if (optValue(parts, "tlsInsecure") && (optValue(parts, "tlsAllowInvalidCertificates") || optValue(parts, "tlsAllowInvalidHostnames"))) {
    err("tlsInsecure cannot be combined with tlsAllowInvalidCertificates or tlsAllowInvalidHostnames.");
  }
  if (
    [optValue(parts, "tlsInsecure"), optValue(parts, "tlsAllowInvalidCertificates"), optValue(parts, "tlsAllowInvalidHostnames")].includes(
      "true",
    )
  ) {
    warn("Certificate validation is turned off. Fine for local testing, risky in production.");
  }
  if (srv && (tls ?? ssl) === "false") warn("mongodb+srv:// turns TLS on by default; tls=false switches it off.");

  const direct = optValue(parts, "directConnection");
  if (direct === "true" && srv) err("directConnection=true is not allowed with mongodb+srv://.");
  if (direct === "true" && parts.hosts.length > 1) err("directConnection=true needs exactly one host.");
  if (optValue(parts, "loadBalanced") === "true") {
    if (parts.hosts.length > 1) err("loadBalanced=true needs exactly one host.");
    if (optValue(parts, "replicaSet")) err("loadBalanced=true cannot be combined with replicaSet.");
    if (direct === "true") err("loadBalanced=true cannot be combined with directConnection=true.");
  }
  if (!srv && optValue(parts, "srvMaxHosts")) err("srvMaxHosts only applies to mongodb+srv://.");
  if (!srv && optValue(parts, "srvServiceName")) err("srvServiceName only applies to mongodb+srv://.");
  if (!srv && parts.hosts.length > 1 && !optValue(parts, "replicaSet") && optValue(parts, "loadBalanced") !== "true") {
    info("Several hosts but no replicaSet: drivers will discover the topology. Add replicaSet=<name> to pin it.");
  }

  const mech = optValue(parts, "authMechanism");
  const authSource = optValue(parts, "authSource");
  if (mech === "MONGODB-X509" && parts.password) err("MONGODB-X509 authenticates with a certificate; remove the password.");
  if (
    mech &&
    ["MONGODB-X509", "GSSAPI", "PLAIN", "MONGODB-AWS", "MONGODB-OIDC"].includes(mech) &&
    authSource &&
    authSource !== "$external"
  ) {
    err(`${mech} users live in the $external database; authSource must be $external.`);
  }
  if (mech && ["SCRAM-SHA-1", "SCRAM-SHA-256", "PLAIN", "GSSAPI"].includes(mech) && !parts.username) err(`${mech} needs a username.`);
  if (parts.username && !mech && !authSource && !parts.database && !srv)
    info("No authSource or database in the path: the driver authenticates against admin.");

  const rp = optValue(parts, "readPreference");
  if (optValue(parts, "maxStalenessSeconds") && (!rp || rp === "primary"))
    err("maxStalenessSeconds cannot be used with readPreference=primary.");
  if (optValue(parts, "readPreferenceTags") && (!rp || rp === "primary"))
    err("readPreferenceTags cannot be used with readPreference=primary.");
  const minPool = optValue(parts, "minPoolSize");
  const maxPool = optValue(parts, "maxPoolSize");
  if (minPool && maxPool && +maxPool !== 0 && +minPool > +maxPool) err("minPoolSize is larger than maxPoolSize.");
  const comp = optValue(parts, "compressors");
  if (comp) for (const c of comp.split(",")) if (!["snappy", "zlib", "zstd", "noop"].includes(c.trim())) warn(`Unknown compressor "${c}".`);
  return issues;
}

/** Percent-encodes a username, password or option value; ":" and "," stay readable inside option values. */
function enc(s: string, keepReadable = false): string {
  const e = encodeURIComponent(s);
  return keepReadable ? e.replace(/%3A/gi, ":").replace(/%2C/gi, ",") : e;
}

function formatHost(h: HostPort): string {
  const host = h.host.includes("/") ? encodeURIComponent(h.host) : h.host; // Unix sockets must be encoded
  return h.port !== undefined ? `${host}:${h.port}` : host;
}

/** Builds a connection string; pass `maskPassword` to replace the password with asterisks for display. */
export function buildConnectionString(parts: ConnParts, opts: { maskPassword?: boolean } = {}): string {
  let s = `${parts.scheme}://`;
  if (parts.username) {
    s += enc(parts.username);
    if (parts.password !== undefined && parts.password !== "") s += ":" + (opts.maskPassword ? "****" : enc(parts.password));
    s += "@";
  }
  s += parts.hosts.map(formatHost).join(",");
  const query = parts.options
    .filter((o) => o.key)
    .map((o) => `${enc(o.key)}=${enc(o.value, true)}`)
    .join("&");
  if (parts.database || query) s += "/" + (parts.database ? enc(parts.database) : "");
  if (query) s += "?" + query;
  return s;
}

/** Masks the password in any connection string, leaving the rest untouched. */
export function maskConnectionString(uri: string): string {
  const m = /^mongodb(?:\+srv)?:\/\//i.exec(uri);
  if (!m) return uri;
  const q = uri.indexOf("?");
  const at = uri.lastIndexOf("@", q < 0 ? uri.length : q);
  const colon = uri.indexOf(":", m[0].length);
  if (at < 0 || colon < 0 || colon > at) return uri;
  return uri.slice(0, colon + 1) + "****" + uri.slice(at);
}
