"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

// Cast needed due to internal @better-fetch version mismatch in @neondatabase/auth
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = authClient as any;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={client}
      theme={{
        colorBackground: "transparent",
        colorBackgroundSecondary: "transparent",
        colorButtonPrimary: "#fafafa",
        colorButtonPrimaryText: "#09090b",
        colorButtonPrimaryHover: "#f4f4f5",
        colorBorder: "rgba(255, 255, 255, 0.1)",
        colorText: "#ffffff",
        colorTextSecondary: "#a1a1aa",
        colorInputBackground: "rgba(255, 255, 255, 0.03)",
        colorInputText: "#ffffff",
        colorInputPlaceholder: "#71717a",
        radius: "0.75rem",
        fontFamily: "var(--font-poppins)",
        elements: {
          mainCard: {
            boxShadow: "none",
            border: "none",
            background: "transparent",
            padding: "0"
          },
          providerButton: {
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
          },
          providerButton_hover: {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }
      }}
      onLogin={() => router.push("/")}
      onSignUp={() => router.push("/")}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
