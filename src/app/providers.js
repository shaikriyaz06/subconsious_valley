"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return (
    <SessionProvider
      refetchInterval={60} // Refetch every 60 seconds
      refetchOnWindowFocus={true} // Enable refetch on window focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      {children}
    </SessionProvider>
  );
}