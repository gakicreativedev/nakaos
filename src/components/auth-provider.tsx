"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";

// Cast needed due to internal @better-fetch version mismatch in @neondatabase/auth
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = authClient as any;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={client}
      redirectTo="/"
      defaultTheme="dark"
    >
      {children}
    </NeonAuthUIProvider>
  );
}
