"use client";
import { useSession } from "next-auth/react";
import { User } from './types/user';

export const useAuth = () => {
  const { data: session, status } = useSession();
  console.log("🔍 useAuth session:", session);

  return {
    user: session?.user as User | undefined,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
