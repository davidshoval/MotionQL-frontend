"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { api, ApiError, type Team } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormError, FormField } from "@/components/app/form-field";

/** Seats are free for now and MotionQL sets the limit, so admins ask for more here. */
export function RequestSeatsDialog({
  team,
  open,
  onOpenChange,
  suggested,
}: {
  team: Team;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** A starting total, e.g. what the admin was trying to add. */
  suggested?: number;
}) {
  const qc = useQueryClient();
  const start = suggested ?? Math.max(team.seatRequest?.seats ?? 0, team.seatLimit + 10);
  const [seats, setSeats] = useState(String(start));
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const send = useMutation({
    mutationFn: () => api.requestSeats(team.id, { seats: Number(seats), note: note.trim() || undefined }),
    onSuccess: () => {
      toast.success("Request sent. We'll raise your limit and you'll see it here.");
      qc.invalidateQueries({ queryKey: ["team", team.id] });
      onOpenChange(false);
    },
    onError: (e) => setError(e instanceof ApiError ? (e.fields?.seats ?? e.message) : "Couldn't send the request. Try again."),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ask for more seats</DialogTitle>
          <DialogDescription>
            Your team has {team.seatLimit} seats and uses {team.seatsUsed}. Team seats are free for now; tell us how many you need and
            we&apos;ll raise the limit.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const n = Number(seats);
            if (!Number.isInteger(n) || n <= team.seatLimit) return setError(`Enter a total above ${team.seatLimit}.`);
            send.mutate();
          }}
        >
          <FormError message={error} />
          <FormField id="seat-total" label="Seats you need in total">
            <Input
              id="seat-total"
              type="number"
              min={team.seatLimit + 1}
              max={100000}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
            />
          </FormField>
          <FormField id="seat-note" label="Note (optional)" hint="For example, when a new group starts.">
            <Input id="seat-note" value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={send.isPending}>
              {send.isPending ? <Loader2 className="animate-spin" /> : <Send />}
              Send request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
