
'use client';

import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Award, CheckCircle2, Bookmark, BarChart, MoreVertical, Shield, ShieldAlert, Trash2, EyeOff, Ban, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';
import type { ForumPost, PostCardPost } from '@/lib/types/forum';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@/lib/types/user';

interface PostCardProps {
  post: PostCardPost;
  onTagClick?: (tag: string) => void;
  onLike?: () => Promise<void>;
  onComment?: (content: string) => Promise<void>;
}

function PostModerationMenu({ post }: { post: PostCardPost }) {
  const { user } = useAuth();
  const userRole = user?.role;

  if (userRole === UserRole.Learner) {
    return null;
  }

  const handleAction = (action: string) => {
    toast.success(`Action: ${action}`, {
      description: `Post "${post.title}" has been ${action.toLowerCase()}. (Simulated)`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userRole === UserRole.Mentor && (
          <DropdownMenuItem onClick={() => handleAction('Escalated')}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            <span>Escalate</span>
          </DropdownMenuItem>
        )}
        {userRole === UserRole.Staff && (
          <>
            <DropdownMenuItem onClick={() => handleAction('Hidden')}>
              <EyeOff className="mr-2 h-4 w-4" />
              <span>Hide</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => handleAction('Deleted')}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => handleAction(`Banned user ${post.author.name}`)}>
              <Ban className="mr-2 h-4 w-4" />
              <span>Ban User</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PollPreview({ post }: { post: ForumPost }) {
  if (post.type !== 'Poll' || !post.pollOptions) return null;

  const totalVotes = post.pollOptions.reduce((sum: number, option: { votes: number }) => sum + option.votes, 0);

  return (
    <div className="space-y-3 mt-4">
      {post.pollOptions.slice(0, 2).map((option) => (
        <div key={option.id}>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="font-medium">{option.text}</span>
            <span className="text-muted-foreground">
              {totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%
            </span>
          </div>
          <Progress value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0} className="h-2" />
        </div>
      ))}
      {post.pollOptions.length > 2 && (
        <p className="text-sm text-muted-foreground text-center">
          + {post.pollOptions.length - 2} more options
        </p>
      )}
    </div>
  );
}


export function PostCard({ post: initialPost, onTagClick, onLike, onComment }: PostCardProps) {
  const [post, setPost] = useState<PostCardPost>(initialPost);
  const { user } = useAuth();

  const [vote, setVote] = useState<"up" | null>(null);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthor = user?.id === post.author.id;

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(vote === 'up') {
        setVote(null);
        setPost(p => ({...p, upvotes: p.upvotes - 1}));
    } else {
        setVote('up');
        setPost(p => ({...p, upvotes: p.upvotes + 1}));
    }
  }

  const handleLike = async () => {
    if (onLike) {
      try {
        setIsLiked(!isLiked);
        await onLike();
      } catch (error) {
        // Revert on error
        setIsLiked(!isLiked);
      }
    } else {
      setIsLiked(!isLiked);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    toast.success(newBookmarkState ? "Post bookmarked!" : "Bookmark removed.");
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onComment) {
      try {
        setIsSubmitting(true);
        await onComment(comment);
        setComment('');
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
      }
    }
  };

  const { author, title, commentCount = 0, tags = [], createdAt, type, acceptedAnswerId } = post;
  
  const voteCount = post.upvotes - post.downvotes;

  const typeStyles: Record<ForumPost['type'], { color: string, name: string }> = {
      Question: { color: 'bg-blue-500', name: 'Question'},
      Note: { color: 'bg-purple-500', name: 'Note'},
      Poll: { color: 'bg-green-500', name: 'Poll'},
      Thread: { color: 'bg-orange-500', name: 'Discussion'},
      AMA: { color: 'bg-red-500', name: 'AMA'},
  }

  return (
    <Card className="hover:border-primary/50 transition-colors flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <UserAvatar user={author} />
              <div>
                <p className="font-semibold">{author.name}</p>
                <p className="text-sm text-muted-foreground">
                  <Link href={`/hubs/${post.hub.slug}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{post.hub.name}</Link> • {createdAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${typeStyles[type].color}`} />
                  {typeStyles[type].name}
              </Badge>
              <PostModerationMenu post={post} />
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Link href={`/posts/${post.id}`}>
            <CardTitle className="text-xl mb-3 hover:text-primary transition-colors">{title}</CardTitle>
        </Link>
        {type === 'Poll' ? <PollPreview post={post} /> : (
          <p className="text-muted-foreground line-clamp-2">{post.content.substring(0, 150)}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="outline"
              className={onTagClick ? 'cursor-pointer hover:bg-secondary' : ''}
              onClick={onTagClick ? (e) => { e.stopPropagation(); onTagClick(tag.name); } : undefined}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        {showCommentInput && (
          <form onSubmit={handleComment} className="mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-1 text-muted-foreground hover:text-foreground", isLiked && "text-blue-500 hover:text-blue-600")}
              onClick={handleLike}
              disabled={!onLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likeCount ?? 0}</span>
            </Button>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
           {acceptedAnswerId && (
            <div className="flex items-center gap-1.5 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Solved</span>
            </div>
           )}
           <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{commentCount}</span>
           </div>
           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBookmark}>
            <Bookmark className={cn("h-4 w-4", isBookmarked && 'text-primary fill-current')} />
           </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
