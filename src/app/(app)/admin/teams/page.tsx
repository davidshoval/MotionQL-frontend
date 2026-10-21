import { Suspense } from "react";
import { TeamsConsole } from "./teams-console";

export default function AdminTeamsPage() {
  return (
    <Suspense>
      <TeamsConsole />
    </Suspense>
  );
}
