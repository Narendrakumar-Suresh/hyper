import { DefaultUser } from 'next-auth';

// User roles - must match the Role type in types.ts
export type UserRole = 'learner' | 'mentor' | 'staff';

// For convenience, we can still use an object with the same values
export const UserRole = {
  Learner: 'learner' as const,
  Mentor: 'mentor' as const,
  Staff: 'staff' as const,
};

import type { LucideIcon } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface PostAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  reputation: number;
  badges: Badge[];
  title: string;
  role: UserRole;
}

export interface Comment {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: PostAuthor;
  hub: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  comments: Comment[];
  tags: Array<{
    id: string;
    name: string;
  }>;
  type: 'Question' | 'Note' | 'Poll' | 'Thread' | 'AMA';
  pollOptions?: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  acceptedAnswerId?: string;
}

// Extend the default User type from next-auth
export interface User extends DefaultUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
}

// Extend the NextAuth session type
declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
  }
}
