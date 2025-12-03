"use client";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "./components/LanguageProvider";

export function Providers({ children }) {
  return (
    <SessionProvider
      refetchInterval={0} // Disable automatic refetch
      refetchOnWindowFocus={false} // Disable refetch on window focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}