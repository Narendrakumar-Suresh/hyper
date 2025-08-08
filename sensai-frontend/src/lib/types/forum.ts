import { Post as BasePost, Comment as BaseComment, User as BaseUser, UserRole } from './user';
import { LucideIcon } from 'lucide-react';
import React from 'react';

// Extend base types with forum-specific properties
export interface Hub {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  postCount: number;
  icon: LucideIcon | React.ComponentType<{ className?: string }> | string;
  isMember?: boolean;
  isCourse?: boolean;
  courseId?: string;
  bannerUrl?: string;
  isPublic?: boolean;
}

export interface HubWithMembership extends Hub {
  isMember: boolean;
  memberSince?: string;
  role?: 'member' | 'moderator' | 'admin';
}

export interface Tag {
  id: string;
  name: string;
}

export interface Comment extends BaseComment {
  postId: string;
  isAccepted?: boolean;
}

// Base post interface that matches the backend DTO
export interface ForumPost extends Omit<BasePost, 'comments' | 'tags' | 'author' | 'hub'> {
  comments: Comment[];
  tags: Tag[];
  linkedTask?: string;
  linkedSkill?: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  upvotes: number;
  downvotes: number;
  hub: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: 'Question' | 'Note' | 'Poll' | 'Thread' | 'AMA';
  pollOptions?: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  acceptedAnswerId?: string;
}

// Type for the post card props
export interface PostCardPost extends Omit<ForumPost, 'author' | 'hub'> {
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  hub: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ForumUser extends BaseUser {
  role: UserRole;
  reputation: number;
  badges: Array<{
    id: string;
    name: string;
    icon: LucideIcon;
    description: string;
  }>;
  title: string;
  avatarUrl: string;
}

// Type guards
export function isHub(hub: unknown): hub is Hub {
  return (
    !!hub && 
    typeof hub === 'object' &&
    'id' in hub &&
    'name' in hub &&
    'slug' in hub &&
    'description' in hub &&
    'memberCount' in hub &&
    'postCount' in hub &&
    'icon' in hub
  );
}

export function isPost(post: unknown): post is BasePost {
  return (
    !!post &&
    typeof post === 'object' &&
    'id' in post &&
    'title' in post &&
    'comments' in post &&
    'tags' in post &&
    Array.isArray((post as BasePost).comments) &&
    Array.isArray((post as BasePost).tags)
  );
}

export function isComment(comment: unknown): comment is Comment {
  return (
    !!comment &&
    typeof comment === 'object' &&
    'id' in comment &&
    'content' in comment &&
    'postId' in comment
  );
}
