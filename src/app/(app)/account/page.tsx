"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Download, KeyRound, Loader2, Mail, MonitorDown, Plus, Settings2, Users } from "lucide-react";
import { api, ApiError, type OS } from "@/lib/api";
import { qk, useLicenses, useMe, useRelease } from "@/lib/api/hooks";
import { detectOS, fileLabel, osLabel, sortFiles, startDownload } from "@/lib/os";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LicenseCard } from "@/components/app/license-card";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { FormField } from "@/components/app/form-field";

export default function AccountPage() {
  const { data: me } = useMe();
  const { data: licenses, isLoading } = useLicenses();
  if (!me) return null;
  const current = licenses?.filter((l) => l.status === "active") ?? [];
  const past = licenses?.filter((l) => l.status !== "active") ?? [];
  const firstName = me.user.name.split(" ")[0] || me.user.name;

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hi {firstName} 👋</h1>
        <p className="text-muted-foreground mt-2">Your license, downloads and teams, all in one place.</p>
      </div>

      {me.pendingInvites.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary/[0.06] px-5 py-4 text-sm">
          <Mail className="size-4 text-primary" />
          {me.pendingInvites.map((i) => (
            <span key={i.id}>
              <span className="font-medium">{i.invitedBy}</span> invited you to <span className="font-medium">{i.teamName}</span>.
            </span>
          ))}
          <span className="text-muted-foreground">Open the link in the invitation e-mail to join.</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="grid content-start gap-6">
          {isLoading ? (
            <Skeleton className="h-80 rounded-3xl" />
          ) : current.length ? (
            current.map((l) => <LicenseCard key={l.licenseId} license={l} />)
          ) : (
            <NoLicense hasPast={past.length > 0} />
          )}
          <Activate />
        </div>
        <div className="grid content-start gap-6">
          <QuickDownload />
          <TeamsCard />
        </div>
      </div>

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Previous keys</h2>
          <div className="divide-border border-border mt-4 divide-y rounded-2xl border">
            {past.map((l) => (
              <div key={l.licenseId} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <span className="text-muted-foreground font-mono">{l.key.slice(0, 18)}…</span>
                <span className="flex items-center gap-3">
                  {l.team && <span className="text-muted-foreground">{l.team.name}</span>}
                  <Badge variant={l.status === "revoked" ? "destructive" : "warning"}>{l.status}</Badge>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Profile />
      <ChangePassword />
      <DangerZone />
    </div>
  );
}

function NoLicense({ hasPast }: { hasPast: boolean }) {
  const qc = useQueryClient();
  const renew = useMutation({
    mutationFn: () => api.renewLicense(),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.licenses }),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : "Couldn't get a key. Try again."),
  });
  return (
    <Card className="p-8 text-center">
      <h2 className="text-xl font-semibold">{hasPast ? "Your key has ended" : "No license yet"}</h2>
      <p className="text-muted-foreground mt-2">Get a free Pro key, valid for 12 months.</p>
      <Button className="mt-6" onClick={() => renew.mutate()} disabled={renew.isPending}>
        {renew.isPending && <Loader2 className="animate-spin" />}
        Get my free Pro key
      </Button>
    </Card>
  );
}

function Activate() {
  const steps = ["Install and open MotionQL", "Go to Settings → License", "Paste your key and click Activate"];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activate in three steps</CardTitle>
        <CardDescription>Activation happens offline. No sign-in inside the app.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="border-border bg-foreground/[0.02] rounded-2xl border p-4 text-sm">
              <span className="text-primary font-mono text-xs">0{i + 1}</span>
              <p className="mt-1.5">{s}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function QuickDownload() {
  const { data: release, isLoading } = useRelease();
  const [os, setOs] = useState<OS | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the visitor's OS is only known in the browser
  useEffect(() => setOs(detectOS()), []);
  const file = release && sortFiles(release.files.filter((f) => f.os === (os ?? "macos")))[0];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MonitorDown className="text-primary size-5" /> Download MotionQL
        </CardTitle>
        <CardDescription>{release ? `Version ${release.version}` : "Latest version"}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {isLoading || !file ? (
          <Skeleton className="h-10 rounded-full" />
        ) : (
          <Button onClick={() => startDownload(file)}>
            <Download />
            {osLabel[file.os]} · {fileLabel(file)}
            <span className="opacity-70">{formatBytes(file.size)}</span>
          </Button>
        )}
        <Button asChild variant="ghost" size="sm">
          <Link href="/download">
            All platforms and checksums <ArrowRight />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function TeamsCard() {
  const { data: me } = useMe();
  if (!me) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-primary size-5" /> Teams
        </CardTitle>
        <CardDescription>Give everyone their own Pro key and manage it in one place. Free for now.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {me.teams.map((t) => (
          <Link
            key={t.id}
            href={`/team/${t.id}`}
            className="border-border hover:border-primary/40 hover:bg-foreground/[0.02] flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition"
          >
            <span className="font-medium">{t.name}</span>
            <span className="text-muted-foreground flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {t.role}
              </Badge>
              {t.hasSeat ? "Pro seat" : "No seat"}
            </span>
          </Link>
        ))}
        <Button asChild variant="secondary" className="mt-1">
          <Link href="/team/new">
            <Plus /> Create a team
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function Profile() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const { register, handleSubmit, formState } = useForm({ values: { name: me?.user.name ?? "", company: me?.user.company ?? "" } });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="text-primary size-5" /> Profile
        </CardTitle>
        <CardDescription>
          Signed in as <span className="text-foreground">{me?.user.email}</span>. Your name and company appear in your license.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          onSubmit={handleSubmit(async (v) => {
            try {
              await api.updateMe({ name: v.name.trim(), company: v.company.trim() || null });
              await qc.invalidateQueries({ queryKey: qk.me });
              toast.success("Profile saved");
            } catch (e) {
              toast.error(e instanceof ApiError ? e.message : "Couldn't save. Try again.");
            }
          })}
        >
          <FormField id="p-name" label="Name">
            <Input id="p-name" {...register("name", { required: true })} />
          </FormField>
          <FormField id="p-company" label="Company">
            <Input id="p-company" {...register("company")} />
          </FormField>
          <Button type="submit" variant="secondary" disabled={formState.isSubmitting || !formState.isDirty}>
            {formState.isSubmitting && <Loader2 className="animate-spin" />}
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-5 text-primary" /> Password
        </CardTitle>
        <CardDescription>Changing it signs you out everywhere else.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
          onSubmit={async (e) => {
            e.preventDefault();
            if (next.length < 10) return setErrors({ newPassword: "Use at least 10 characters" });
            setBusy(true);
            setErrors({});
            try {
              await api.changePassword(current, next);
              setCurrent("");
              setNext("");
              toast.success("Password changed");
            } catch (err) {
              if (err instanceof ApiError && err.fields) setErrors(err.fields);
              else toast.error(err instanceof ApiError ? err.message : "Couldn't change your password.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <FormField id="pw-current" label="Current password" error={errors.currentPassword}>
            <Input id="pw-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </FormField>
          <FormField id="pw-new" label="New password" error={errors.newPassword}>
            <Input id="pw-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
          </FormField>
          <Button type="submit" variant="secondary" className="sm:mt-6" disabled={busy || !current || !next}>
            {busy && <Loader2 className="animate-spin" />}
            Change
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DangerZone() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const qc = useQueryClient();
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>
          Deletes your account and revokes your keys. MotionQL on your computer keeps working on the free tier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setOpen(true)}
        >
          Delete my account
        </Button>
      </CardContent>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        destructive
        title="Delete your account?"
        description="This can't be undone. Your license keys stop working and you leave every team."
        confirmLabel="Delete account"
        input={{ label: "Enter your password to confirm", type: "password", autoComplete: "current-password" }}
        onConfirm={async (password) => {
          try {
            await api.deleteMe(password);
            qc.clear();
            router.push("/");
          } catch (e) {
            const msg = e instanceof ApiError ? (e.fields?.password ?? e.message) : "Couldn't delete your account.";
            toast.error(msg);
          }
        }}
      />
    </Card>
  );
}
