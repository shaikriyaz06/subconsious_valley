"use client";
import { useSession } from "next-auth/react";

export function ConditionalAuth({ children }) {
  // Always use actual session data for proper UI state
  const { data: session, status } = useSession();
  return children({ session, status });
}