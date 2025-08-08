import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';
import { Hub, Post as ForumPost, Comment, ForumUser, Tag } from '@/lib/types/forum';

// Get the base URL from environment variables or use a default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Extended interfaces for API-specific types
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}

// Backend DTOs that might differ from frontend types
interface UserDto {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  joinDate: string;
  postCount: number;
  reputation?: number;
  title?: string;
  badges?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

interface PostDto {
  id: string;
  title: string;
  content: string;
  author: UserDto;
  hub: {
    id: string;
    name: string;
    slug: string;
  };
  comments: CommentDto[];
  tags: Tag[];
  isPinned?: boolean;
  isLocked?: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isSolution?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CommentDto {
  id: string;
  content: string;
  author: UserDto;
  postId: string;
  isAccepted?: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface HubDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  memberCount: number;
  postCount: number;
  isMember?: boolean;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps a user DTO to the ForumUser type
 */
function mapUserDtoToUser(user: UserDto): ForumUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || '/images/default-avatar.png',
    role: user.role as any, // Will be handled by type guards
    reputation: user.reputation || 0,
    badges: user.badges || [],
    title: user.title || 'Member'
  };
}

/**
 * Maps a post DTO to the ForumPost type
 */
function mapPostDtoToPost(post: PostDto): ForumPost {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: mapUserDtoToUser(post.author),
    hub: {
      id: post.hub.id,
      name: post.hub.name,
      slug: post.hub.slug,
      description: '', // Will be populated if needed
      memberCount: 0, // Will be populated if needed
      postCount: post.commentCount,
      icon: () => null // Default icon component
    },
    comments: post.comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: mapUserDtoToUser(comment.author),
      postId: comment.postId,
      isAccepted: comment.isAccepted,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    })),
    tags: post.tags || [],
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
}

// API Client
class ForumAPI {
  private static instance: ForumAPI;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/forum`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(async (config) => {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized error (e.g., redirect to login)
          console.error('Authentication required');
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ForumAPI {
    if (!ForumAPI.instance) {
      ForumAPI.instance = new ForumAPI();
    }
    return ForumAPI.instance;
  }

  // Hubs
  async getHubs(): Promise<Hub[]> {
    const response = await this.client.get<ApiResponse<HubDto[]>>('/hubs');
    return response.data.data.map(hub => ({
      ...hub,
      icon: () => null, // Default icon component
      isMember: hub.isMember || false
    }));
  }

  async getHub(id: string): Promise<Hub> {
    const response = await this.client.get<ApiResponse<HubDto>>(`/hubs/${id}`);
    const hub = response.data.data;
    return {
      ...hub,
      icon: () => null, // Default icon component
      isMember: hub.isMember || false
    };
  }

  async createHub(data: { name: string; description: string }): Promise<Hub> {
    const response = await this.client.post<ApiResponse<HubDto>>('/hubs', data);
    const hub = response.data.data;
    return {
      ...hub,
      icon: () => null, // Default icon component
      isMember: true // Creator is automatically a member
    };
  }

  async joinHub(hubId: string): Promise<void> {
    await this.client.post(`/hubs/${hubId}/join`);
  }

  async leaveHub(hubId: string): Promise<void> {
    await this.client.post(`/hubs/${hubId}/leave`);
  }

  // Posts
  async getPosts(hubId?: string): Promise<ForumPost[]> {
    const url = hubId ? `/hubs/${hubId}/posts` : '/posts';
    const response = await this.client.get<ApiResponse<PostDto[]>>(url);
    return response.data.data.map(mapPostDtoToPost);
  }

  async getPost(postId: string): Promise<ForumPost> {
    const response = await this.client.get<ApiResponse<PostDto>>(`/posts/${postId}`);
    return mapPostDtoToPost(response.data.data);
  }

  async createPost(data: {
    title: string;
    content: string;
    hubId: string;
    tags?: string[];
  }): Promise<ForumPost> {
    const response = await this.client.post<ApiResponse<PostDto>>('/posts', data);
    return mapPostDtoToPost(response.data.data);
  }

  // Comments
  async createComment(postId: string, content: string): Promise<Comment> {
    const response = await this.client.post<ApiResponse<CommentDto>>(
      `/posts/${postId}/comments`,
      { content }
    );
    const comment = response.data.data;
    return {
      ...comment,
      author: mapUserDtoToUser(comment.author)
    };
  }

  // Interactions
  async likePost(postId: string): Promise<number> {
    const response = await this.client.post<ApiResponse<{ likeCount: number }>>(
      `/posts/${postId}/like`
    );
    return response.data.data.likeCount;
  }

  async markAsSolution(commentId: string): Promise<void> {
    await this.client.post(`/comments/${commentId}/solution`);
  }

  // Search
  async search(query: string): Promise<{
    hubs: Hub[];
    posts: ForumPost[];
  }> {
    const response = await this.client.get<ApiResponse<{
      hubs: HubDto[];
      posts: PostDto[];
    }>>('/search', { params: { q: query } });
    
    return {
      hubs: response.data.data.hubs.map(hub => ({
        ...hub,
        icon: () => null, // Default icon component
        isMember: hub.isMember || false
      })),
      posts: response.data.data.posts.map(mapPostDtoToPost)
    };
  }
}

// Export a singleton instance of the API client
export const forumAPI = ForumAPI.getInstance();

// Re-export types from the forum types file
export type { Hub, Comment, ForumUser as User, ForumPost as Post, Tag } from '@/lib/types/forum';
