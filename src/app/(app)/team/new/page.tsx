"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { qk } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormError, FormField } from "@/components/app/form-field";

export default function NewTeamPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <Card className="mx-auto max-w-lg p-8">
      <span className="bg-primary/15 text-primary grid size-12 place-items-center rounded-2xl">
        <Users className="size-6" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Create a team</h1>
      <p className="text-muted-foreground mt-2">
        You&apos;ll be the owner. Invite people next; each gets their own Pro key. Seats are free for now.
      </p>
      <form
        className="mt-8 grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return setError("Give your team a name.");
          setBusy(true);
          setError(null);
          try {
            const { team } = await api.createTeam(name.trim());
            await qc.invalidateQueries({ queryKey: qk.me });
            router.push(`/team/${team.id}`);
          } catch (err) {
            setError(err instanceof ApiError ? err.message : "Couldn't create the team.");
            setBusy(false);
          }
        }}
      >
        <FormError message={error} />
        <FormField id="team-name" label="Team or company name">
          <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Data" autoFocus />
        </FormField>
        <Button type="submit" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />}
          Create team
        </Button>
      </form>
    </Card>
  );
}
