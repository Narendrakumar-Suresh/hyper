import { DefaultSession } from "next-auth";
import { UserRole } from "@/lib/types/user";

declare module "next-auth" {
  /**
   * Extend the built-in session and user types
   */
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      accessToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    accessToken?: string;
  }
}