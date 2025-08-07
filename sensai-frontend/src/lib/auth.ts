"use client";
import { useSession } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();
  console.log("🔍 useAuth session:", session); // <- Check this in dev console

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
