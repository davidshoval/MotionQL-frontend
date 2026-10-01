"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Download, LogOut, User as UserIcon, Users } from "lucide-react";
import { api, type User, type TeamSummary } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function initials(nameOrEmail: string) {
  const parts = nameOrEmail.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function Avatar({ label, className = "size-8 text-xs" }: { label: string; className?: string }) {
  // A stable hue per person keeps member lists scannable.
  const hue = [...label].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${className}`}
      style={{ background: `linear-gradient(135deg, oklch(0.62 0.13 ${hue}), oklch(0.45 0.1 ${(hue + 40) % 360}))` }}
      aria-hidden
    >
      {initials(label)}
    </span>
  );
}

export function UserMenu({ user, teams }: { user: User; teams: TeamSummary[] }) {
  const router = useRouter();
  const qc = useQueryClient();
  async function signOut() {
    await api.logout().catch(() => undefined);
    qc.clear();
    router.push("/");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus-visible:ring-ring cursor-pointer rounded-full outline-none focus-visible:ring-2"
        aria-label="Account menu"
      >
        <Avatar label={user.name || user.email} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p className="text-foreground truncate text-sm font-medium">{user.name}</p>
          <p className="truncate">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon /> Account and license
          </Link>
        </DropdownMenuItem>
        {teams.map((t) => (
          <DropdownMenuItem key={t.id} asChild>
            <Link href={`/team/${t.id}`}>
              <Users /> {t.name}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <Link href="/download">
            <Download /> Download
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
