"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

export function UserAvatar({ user, className }: { user: Partial<User>, className?: string }) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
    
  return (
    <Avatar className={cn("bg-secondary", className)}>
      <AvatarImage src={user.avatarUrl} alt={user.name || ''} data-ai-hint="person portrait" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
