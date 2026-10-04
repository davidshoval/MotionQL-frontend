"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AUTH_MECHANISMS,
  OPTION_SPECS,
  READ_PREFERENCES,
  buildConnectionString,
  findOptionSpec,
  parseConnectionString,
  type ConnParts,
} from "@/lib/tools/connection-string";
import { CodeBlock, CopyText, Notice, Panel, selectClass } from "./shared";

const EXAMPLE = "mongodb+srv://appUser:s3cr%40t@cluster0.example.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

/** Options with their own form controls; everything else shows in the generic list. */
const COMMON = ["authSource", "authMechanism", "replicaSet", "readPreference", "tls", "retryWrites", "appName", "directConnection"];

function getOpt(parts: ConnParts, key: string) {
  return parts.options.find((o) => o.key.toLowerCase() === key.toLowerCase())?.value ?? "";
}

function setOpt(parts: ConnParts, key: string, value: string): ConnParts {
  const idx = parts.options.findIndex((o) => o.key.toLowerCase() === key.toLowerCase());
  const options = [...parts.options];
  if (!value) {
    if (idx >= 0) options.splice(idx, 1);
  } else if (idx >= 0) options[idx] = { key: options[idx].key, value };
  else options.push({ key, value });
  return { ...parts, options };
}

function FieldRow({ label, htmlFor, children, hint }: { label: string; htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-muted-foreground text-xs font-normal">
        {label}
      </Label>
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  );
}

function TriSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <select id={id} className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Default</option>
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
}

export function ConnectionStringTool() {
  const [uri, setUri] = useState(EXAMPLE);
  const [parts, setParts] = useState<ConnParts>(() => parseConnectionString(EXAMPLE).parts!);
  const [showPw, setShowPw] = useState(false);

  const parsed = useMemo(() => parseConnectionString(uri), [uri]);
  const built = buildConnectionString(parts);
  const masked = buildConnectionString(parts, { maskPassword: true });

  const onUri = (v: string) => {
    setUri(v);
    const r = parseConnectionString(v);
    if (r.parts) setParts(r.parts);
  };
  const update = (next: ConnParts) => {
    setParts(next);
    setUri(buildConnectionString(next));
  };
  const srv = parts.scheme === "mongodb+srv";
  const others = parts.options.map((o, i) => ({ ...o, i })).filter((o) => !COMMON.some((c) => c.toLowerCase() === o.key.toLowerCase()));
  const errors = parsed.issues.filter((i) => i.level === "error").length;

  return (
    <div className="grid gap-4">
      <Panel
        title={<label htmlFor="cs-input">Paste a connection string to parse it, or edit the fields below</label>}
        actions={
          <>
            <Button type="button" variant="ghost" size="sm" onClick={() => onUri(EXAMPLE)}>
              Example
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => onUri("mongodb://localhost:27017")}>
              Localhost
            </Button>
          </>
        }
      >
        <Input
          id="cs-input"
          value={uri}
          onChange={(e) => onUri(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="font-mono text-[13px]"
          aria-invalid={errors > 0}
          placeholder="mongodb://user:password@host:27017/db?replicaSet=rs0"
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Panel title="Builder">
          <div className="grid gap-5">
            <Tabs
              value={parts.scheme}
              onValueChange={(v) =>
                update({
                  ...parts,
                  scheme: v as ConnParts["scheme"],
                  hosts: v === "mongodb+srv" ? [{ host: parts.hosts[0]?.host ?? "" }] : parts.hosts,
                })
              }
            >
              <TabsList aria-label="Connection type">
                <TabsTrigger value="mongodb">
                  <span className="hidden sm:inline">Standard</span>
                  <span className="font-mono text-xs">mongodb://</span>
                </TabsTrigger>
                <TabsTrigger value="mongodb+srv">
                  <span className="hidden sm:inline">DNS seed list</span>
                  <span className="font-mono text-xs">mongodb+srv://</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <fieldset className="grid gap-2">
              <legend className="text-muted-foreground mb-1.5 text-xs">{srv ? "SRV host name" : "Hosts"}</legend>
              {parts.hosts.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    aria-label={`Host ${i + 1}`}
                    value={h.host}
                    placeholder={srv ? "cluster0.abcde.mongodb.net" : "localhost"}
                    spellCheck={false}
                    onChange={(e) => update({ ...parts, hosts: parts.hosts.map((x, j) => (j === i ? { ...x, host: e.target.value } : x)) })}
                  />
                  {!srv && (
                    <Input
                      aria-label={`Port ${i + 1}`}
                      className="w-28"
                      inputMode="numeric"
                      placeholder="27017"
                      value={h.port ?? ""}
                      onChange={(e) => {
                        const p = e.target.value.replace(/\D/g, "");
                        update({ ...parts, hosts: parts.hosts.map((x, j) => (j === i ? { ...x, port: p ? Number(p) : undefined } : x)) });
                      }}
                    />
                  )}
                  {parts.hosts.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove host ${i + 1}`}
                      onClick={() => update({ ...parts, hosts: parts.hosts.filter((_, j) => j !== i) })}
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
              {!srv && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-fit"
                  onClick={() => update({ ...parts, hosts: [...parts.hosts, { host: "", port: 27017 }] })}
                >
                  <Plus /> Add host
                </Button>
              )}
            </fieldset>

            <div className="grid gap-3 sm:grid-cols-2">
              <FieldRow label="Username" htmlFor="cs-user">
                <Input
                  id="cs-user"
                  value={parts.username ?? ""}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => update({ ...parts, username: e.target.value || undefined })}
                />
              </FieldRow>
              <FieldRow label="Password" htmlFor="cs-pass">
                <div className="relative">
                  <Input
                    id="cs-pass"
                    type={showPw ? "text" : "password"}
                    autoComplete="off"
                    value={parts.password ?? ""}
                    className="pr-11"
                    onChange={(e) => update({ ...parts, password: e.target.value || undefined })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FieldRow>
              <FieldRow label="Default database (path)" htmlFor="cs-db">
                <Input
                  id="cs-db"
                  value={parts.database ?? ""}
                  spellCheck={false}
                  placeholder="optional"
                  onChange={(e) => update({ ...parts, database: e.target.value || undefined })}
                />
              </FieldRow>
              <FieldRow label="authSource" htmlFor="cs-authsource">
                <Input
                  id="cs-authsource"
                  value={getOpt(parts, "authSource")}
                  placeholder={srv ? "from DNS TXT, else admin" : "admin"}
                  spellCheck={false}
                  onChange={(e) => update(setOpt(parts, "authSource", e.target.value))}
                />
              </FieldRow>
              <FieldRow label="authMechanism" htmlFor="cs-mech">
                <select
                  id="cs-mech"
                  className={selectClass}
                  value={getOpt(parts, "authMechanism")}
                  onChange={(e) => update(setOpt(parts, "authMechanism", e.target.value))}
                >
                  <option value="">Default (SCRAM)</option>
                  {AUTH_MECHANISMS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="replicaSet" htmlFor="cs-rs">
                <Input
                  id="cs-rs"
                  value={getOpt(parts, "replicaSet")}
                  spellCheck={false}
                  placeholder="optional"
                  onChange={(e) => update(setOpt(parts, "replicaSet", e.target.value))}
                />
              </FieldRow>
              <FieldRow label="readPreference" htmlFor="cs-rp">
                <select
                  id="cs-rp"
                  className={selectClass}
                  value={getOpt(parts, "readPreference")}
                  onChange={(e) => update(setOpt(parts, "readPreference", e.target.value))}
                >
                  <option value="">Default (primary)</option>
                  {READ_PREFERENCES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </FieldRow>
              <FieldRow label="appName" htmlFor="cs-app">
                <Input
                  id="cs-app"
                  value={getOpt(parts, "appName")}
                  spellCheck={false}
                  placeholder="optional"
                  onChange={(e) => update(setOpt(parts, "appName", e.target.value))}
                />
              </FieldRow>
              <FieldRow label="tls" htmlFor="cs-tls">
                <TriSelect id="cs-tls" value={getOpt(parts, "tls")} onChange={(v) => update(setOpt(parts, "tls", v))} />
              </FieldRow>
              <FieldRow label="retryWrites" htmlFor="cs-rw">
                <TriSelect id="cs-rw" value={getOpt(parts, "retryWrites")} onChange={(v) => update(setOpt(parts, "retryWrites", v))} />
              </FieldRow>
              {!srv && (
                <FieldRow label="directConnection" htmlFor="cs-direct">
                  <TriSelect
                    id="cs-direct"
                    value={getOpt(parts, "directConnection")}
                    onChange={(v) => update(setOpt(parts, "directConnection", v))}
                  />
                </FieldRow>
              )}
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-muted-foreground mb-1.5 text-xs">Other options</legend>
              <datalist id="cs-option-names">
                {OPTION_SPECS.filter((s) => !s.deprecated && !COMMON.includes(s.name)).map((s) => (
                  <option key={s.name} value={s.name} />
                ))}
              </datalist>
              {others.map((o) => (
                <div key={o.i} className="flex gap-2">
                  <Input
                    aria-label="Option name"
                    list="cs-option-names"
                    value={o.key}
                    spellCheck={false}
                    placeholder="option"
                    onChange={(e) =>
                      update({ ...parts, options: parts.options.map((x, j) => (j === o.i ? { ...x, key: e.target.value } : x)) })
                    }
                  />
                  <Input
                    aria-label={`Value for ${o.key || "option"}`}
                    value={o.value}
                    spellCheck={false}
                    placeholder="value"
                    onChange={(e) =>
                      update({ ...parts, options: parts.options.map((x, j) => (j === o.i ? { ...x, value: e.target.value } : x)) })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${o.key || "option"}`}
                    onClick={() => update({ ...parts, options: parts.options.filter((_, j) => j !== o.i) })}
                  >
                    <X />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-fit"
                onClick={() => setParts({ ...parts, options: [...parts.options, { key: "", value: "" }] })}
              >
                <Plus /> Add option
              </Button>
            </fieldset>
          </div>
        </Panel>

        <div className="grid content-start gap-4">
          <Panel title="Connection string" actions={<CopyText value={masked} label="Copy masked" />}>
            <CodeBlock value={masked} wrap />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">The password is masked on screen. Copy the real string only when you need it.</p>
              <CopyText value={built} label="Copy with password" />
            </div>
          </Panel>

          <Panel title={parsed.issues.length ? `Checks (${parsed.issues.length})` : "Checks"}>
            <div className="grid gap-2">
              {parsed.issues.length === 0 && <Notice level="good" title="No problems found" />}
              {parsed.issues.map((i, k) => (
                <Notice key={k} level={i.level} title={i.message} />
              ))}
            </div>
          </Panel>

          {parsed.parts && (
            <Panel title="Parsed">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Scheme</dt>
                <dd className="font-mono">{parsed.parts.scheme}://</dd>
                <dt className="text-muted-foreground">Host{parsed.parts.hosts.length > 1 ? "s" : ""}</dt>
                <dd className="font-mono break-all">
                  {parsed.parts.hosts.map((h) => (h.port ? `${h.host}:${h.port}` : h.host)).join(", ") || "-"}
                </dd>
                <dt className="text-muted-foreground">Username</dt>
                <dd className="font-mono break-all">{parsed.parts.username ?? "-"}</dd>
                <dt className="text-muted-foreground">Password</dt>
                <dd className="font-mono">{parsed.parts.password ? "•".repeat(Math.min(parsed.parts.password.length, 12)) : "-"}</dd>
                <dt className="text-muted-foreground">Database</dt>
                <dd className="font-mono break-all">{parsed.parts.database ?? "-"}</dd>
              </dl>
              {parsed.parts.options.length > 0 && (
                <ul className="border-border mt-4 grid gap-2.5 border-t pt-4">
                  {parsed.parts.options.map((o, i) => {
                    const spec = findOptionSpec(o.key);
                    return (
                      <li key={i} className="text-sm">
                        <span className="font-mono">
                          {o.key}=<span className="text-primary break-all">{o.value}</span>
                        </span>
                        <p className="text-muted-foreground text-xs">{spec ? spec.description : "Not a standard option."}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
