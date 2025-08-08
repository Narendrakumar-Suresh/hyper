import type { LucideIcon } from 'lucide-react';

export type Role = 'learner' | 'mentor' | 'staff';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  reputation: number;
  badges: Badge[];
  title: string;
  role: Role;
};

export type Hub = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  postCount: number;
  memberCount: number;
};

export type PostType = 'Question' | 'Note' | 'Poll' | 'Thread' | 'AMA';

export type Tag = {
  id: string;
  name: string;
};

export type Comment = {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  isAcceptedAnswer?: boolean;
};

export type PollOption = {
  id: string;
  text: string;
  votes: number;
}

export type Post = {
  id: string;
  title: string;
  author: User;
  type: PostType;
  hub: Pick<Hub, 'id' | 'name' | 'slug'>;
  studyGroupId?: string;
  content: string;
  tags: Tag[];
  linkedTask?: string;
  linkedSkill?: string;
  linkedBadge?: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  commentCount: number;
  createdAt: string;
  pollOptions?: PollOption[];
  acceptedAnswerId?: string;
};

export type Badge = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
};

export type Notification = {
  id:string;
  text: string;
  createdAt: string;
  read: boolean;
};

export type StudyGroup = {
  id: string;
  hubId: string;
  name: string;
  description: string;
  memberCount: number;
  avatarUrl: string;
  members: User[];
};
