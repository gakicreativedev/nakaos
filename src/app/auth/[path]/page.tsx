"use client";

import { AuthView, getViewByPath, authViewPaths } from "@neondatabase/auth/react";
import { useParams } from "next/navigation";

export default function AuthPage() {
  const params = useParams<{ path: string }>();
  const path = params.path;
  const view = getViewByPath(authViewPaths, path);

  if (!view) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AuthView view={view} />
    </div>
  );
}
