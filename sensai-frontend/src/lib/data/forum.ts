import { UserRole } from '../types/user';
import { Post, Comment, Hub, Tag } from '../types/forum';
import { Check, Trophy, Star } from 'lucide-react';

// Define mock data interfaces that extend the base types with required properties
interface MockUser {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  reputation: number;
  badges: Array<{ id: string; name: string; icon: any }>;
  title: string;
}

interface MockComment extends Omit<Comment, 'author'> {
  author: MockUser;
  postId: string;
}

interface MockPost extends Omit<Post, 'author' | 'hub' | 'comments' | 'tags'> {
  author: MockUser;
  hub: Pick<Hub, 'id' | 'name' | 'slug'>;
  comments: MockComment[];
  tags: Tag[];
}

// Define mock data interfaces that extend the base types with required properties
interface MockUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  reputation: number;
  badges: Array<{ id: string; name: string; icon: any }>;
  title: string;
}

interface MockPost extends Omit<Post, 'author' | 'hub' | 'comments' | 'tags'> {
  author: MockUser;
  hub: Pick<Hub, 'id' | 'name' | 'slug'>;
  comments: Array<Omit<Comment, 'author' | 'postId'> & { author: MockUser }>;
  tags: Tag[];
}

// Mock icons as strings to avoid JSX in data file
const CheckIcon = Check;
const TrophyIcon = Trophy;
const StarIcon = Star;

// Mock badges for users
const mockBadges = [
  {
    id: 'badge-1',
    name: 'Helper',
    description: 'Helped 10+ users',
    icon: Check,
  },
  {
    id: 'badge-2',
    name: 'Top Contributor',
    description: 'Top 10% of contributors',
    icon: Trophy,
  },
  {
    id: 'badge-3',
    name: 'Rising Star',
    description: 'Earned 100+ reputation',
    icon: Star,
  },
];

// Extend the User type to include our custom properties
type ForumUser = User & {
  avatarUrl: string;
  reputation: number;
  badges: Array<{
    id: string;
    name: string;
    icon: any; // Using any for Lucide icons to avoid type issues
    description: string;
  }>;
  title: string;
};

export const mockCurrentUser: ForumUser = {
  id: 'user-1',
  name: 'Current User',
  email: 'user@example.com',
  avatarUrl: '/avatars/user1.jpg',
  reputation: 150,
  badges: [mockBadges[0], mockBadges[2]],
  title: 'Active Learner',
  role: UserRole.Learner,
};

export const mockHubs = [
  {
    id: 'hub-1',
    slug: 'general-discussion',
    name: 'General Discussion',
    description: 'Discuss anything related to the course',
    memberCount: 245,
    postCount: 1243,
    isMember: true,
    icon: CheckIcon,
  },
  {
    id: 'hub-2',
    slug: 'q-and-a',
    name: 'Q&A',
    description: 'Ask questions and get answers from the community',
    memberCount: 312,
    postCount: 876,
    isMember: true,
    icon: TrophyIcon,
  },
  {
    id: 'hub-3',
    slug: 'study-group',
    name: 'Study Group',
    description: 'Organize study sessions and group work',
    memberCount: 87,
    postCount: 231,
    isMember: false,
    icon: StarIcon,
  },
];

export const mockUsers: MockUser[] = [
  {
    id: 'user-2',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=user2',
    role: UserRole.Learner,
    reputation: 250,
    badges: [],
    title: 'Community Member',
  },
  {
    id: 'user-3',
    name: 'Fellow Learner',
    email: 'fellow@example.com',
    avatarUrl: '/avatars/student1.jpg',
    reputation: 45,
    badges: [],
    title: 'New Member',
    role: UserRole.Learner,
  },
  {
    id: 'user-4',
    name: 'Another Student',
    email: 'another@example.com',
    avatarUrl: '/avatars/student2.jpg',
    reputation: 120,
    badges: [mockBadges[0]],
    title: 'Active Member',
    role: UserRole.Learner,
  },
  {
    id: 'user-5',
    name: 'Helpful Peer',
    email: 'helpful@example.com',
    avatarUrl: '/avatars/student3.jpg',
    reputation: 320,
    badges: [mockBadges[0], mockBadges[2]],
    title: 'Community Helper',
    role: UserRole.Learner,
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Welcome to our learning community!',
    content: 'This is the first post in our new learning hub. Feel free to introduce yourself!',
    author: mockUsers[0],
      name: 'Alex Johnson',
      avatarUrl: 'https://i.pravatar.cc/150?u=user2',
      role: UserRole.Learner,
      reputation: 250,
      badges: [],
      title: 'Community Member',
    }, hub: {
      id: 'hub-1',
      slug: 'general-discussion',
      name: 'General Discussion'
    },
    createdAt: new Date('2023-06-15T10:00:00Z').toISOString(),
    upvotes: 42,
    downvotes: 2,
    commentCount: 2,
    comments: [
      {
        id: 'comment-1',
        content: 'Welcome to the community!',
        createdAt: '2023-05-01T10:15:00Z',
        updatedAt: '2023-05-01T10:15:00Z',
        upvotes: 5,
        downvotes: 0,
        isAccepted: false,
        postId: 'post-1',
        author: {
          id: 'user-2',
          name: 'Alex Johnson',
          avatarUrl: 'https://i.pravatar.cc/150?u=user2',
          role: UserRole.Learner,
          reputation: 250,
          badges: [],
          title: 'Community Member'
        }
      },
      {
        id: 'comment-2',
        content: 'Excited to be part of this community!',
        author: {
          id: 'user-4',
          name: 'Another Student',
          avatarUrl: '/avatars/student2.jpg',
          reputation: 120,
          badges: [mockBadges[0]],
          title: 'Active Member',
          role: UserRole.Learner
        },
        createdAt: new Date('2023-06-15T12:15:00Z').toISOString(),
        upvotes: 3,
        downvotes: 0
      }
    ],
    tags: [
      { id: 'tag-1', name: 'welcome' },
      { id: 'tag-2', name: 'introduction' }
    ] as const,
    type: 'Thread',
  },
  {
    id: 'post-2',
    title: 'How do I solve this problem?',
    content: 'I\'m having trouble with the first exercise. Can someone help me understand the solution?',
    author: {
      id: 'user-3',
      name: 'Fellow Learner',
      avatarUrl: '/avatars/student1.jpg',
      reputation: 45,
      badges: [],
      title: 'New Member',
      role: UserRole.Learner,
    },
    hub: {
      id: 'hub-2',
      slug: 'q-and-a',
      name: 'Q&A'
    },
    createdAt: new Date('2023-06-16T14:30:00Z').toISOString(),
    upvotes: 15,
    downvotes: 1,
    commentCount: 1,
    comments: [
      {
        id: 'comment-3',
        content: 'I had the same issue. Did you try checking the documentation?',
        author: {
          id: 'user-5',
          name: 'Helpful Peer',
          avatarUrl: '/avatars/student3.jpg',
          reputation: 320,
          badges: [mockBadges[0], mockBadges[2]],
          title: 'Community Helper',
          role: UserRole.Learner
        },
        createdAt: new Date('2023-06-16T15:45:00Z').toISOString(),
        upvotes: 2,
        downvotes: 0
      }
    ],
    tags: [
      { id: 'tag-3', name: 'help' },
      { id: 'tag-4', name: 'exercise' },
      { id: 'tag-5', name: 'problem-solving' }
    ] as const,
    type: 'Question',
  },
];

export const mockTopics = [
  { id: 'topic-1', name: 'Getting Started', postCount: 12 },
  { id: 'topic-2', name: 'Troubleshooting', postCount: 8 },
  { id: 'topic-3', name: 'Best Practices', postCount: 15 },
  { id: 'topic-4', name: 'Resources', postCount: 6 },
];
