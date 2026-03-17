"use client";

import { AccountView, getViewByPath, accountViewPaths } from "@neondatabase/auth/react";
import { useParams } from "next/navigation";

export default function AccountPage() {
  const params = useParams<{ path: string }>();
  const path = params.path;
  const view = getViewByPath(accountViewPaths, path);

  if (!view) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AccountView view={view} />
    </div>
  );
}
