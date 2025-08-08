
'use client';

import { useState } from 'react';
// import { mockCurrentUser } from '@/lib/data';
import { mockCurrentUser } from '@/lib/data/forum';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import {
  Bookmark,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  BrainCircuit,
  Loader2,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { CommentCard } from '@/components/CommentCard';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { summarizeLongDiscussion } from '@/ai/flows/summarize-long-discussion';
import type { Post, Comment, PollOption } from '@/lib/types';
import { TranslatedContent } from '@/components/TranslatedContent';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

function Poll({ post }: { post: Post }) {
    const [options, setOptions] = useState<PollOption[]>(post.pollOptions || []);
    const [voted, setVoted] = useState<string | null>(null);
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

    const handleVote = (optionId: string) => {
        if (voted) return;
        setVoted(optionId);
        setOptions(currentOptions => currentOptions.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        ));
    };

    return (
        <div className="space-y-3 mt-4">
            {options.map(option => {
                const percentage = totalVotes > 0 ? (option.votes / (totalVotes + (voted ? 1 : 0))) * 100 : 0;
                return (
                    <div key={option.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-muted-foreground">{option.votes} votes</span>
                        </div>
                        <div className="relative">
                            <Progress value={percentage} className="h-8" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    className="w-full h-full text-foreground"
                                    onClick={() => handleVote(option.id)}
                                    disabled={!!voted}
                                >
                                    {voted === option.id && <Check className="mr-2 h-4 w-4" />}
                                    {voted ? `${Math.round(percentage)}%` : 'Vote'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export function PostPageClient({ post: initialPost }: { post: Post }) {
  const [post, setPost] = useState(initialPost);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  
  const handleVote = (type: "up" | "down") => {
    if (vote === type) {
      setVote(null);
      setPost(p => ({...p, upvotes: type === "up" ? p.upvotes -1 : p.upvotes, downvotes: type === "down" ? p.downvotes - 1 : p.downvotes }));
      toast.success('Vote removed!');
    } else {
      let newUpvotes = post.upvotes;
      let newDownvotes = post.downvotes;

      if(vote === 'up') newUpvotes--;
      if(vote === 'down') newDownvotes--;
      
      if(type === 'up') newUpvotes++;
      if(type === 'down') newDownvotes++;

      setVote(type);
      setPost(p => ({...p, upvotes: newUpvotes, downvotes: newDownvotes}));
      toast.success('Your vote has been recorded!');
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success('Comment posted successfully!');
  }

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    try {
      const discussionText = [
        `Title: ${post.title}`,
        `Post by ${post.author.name}: ${post.content}`,
        ...post.comments.map(
          (c) => `Comment by ${c.author.name}: ${c.content}`
        ),
      ].join('\n\n---\n\n');

      const result = await summarizeLongDiscussion({
        discussion: discussionText,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing discussion:', error);
      setSummary("Sorry, I couldn't generate a summary at this time.");
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handlePostComment = () => {
    if(!newComment.trim()) return;
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      postId: post.id,
      author: mockCurrentUser,
      content: newComment,
      createdAt: 'Just now',
      upvotes: 0,
      downvotes: 0,
    };
    setPost(p => ({
        ...p,
        comments: [comment, ...p.comments],
        commentCount: p.commentCount + 1,
    }));
    setNewComment("");
    toast.success('Comment posted!');
  }

  const voteCount = post.upvotes - post.downvotes;
  const sortedComments = post.comments.sort(
    (a, b) =>
      (b.isAcceptedAnswer ? 1 : -1) -
        (a.isAcceptedAnswer ? -1 : 1) ||
      b.upvotes - a.upvotes
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{post.type}</Badge>
              <Link
                href={`/hubs/${post.hub.slug}`}
                className="text-muted-foreground hover:underline"
              >
                in{' '}
                <span className="font-semibold text-primary">
                  {post.hub.name}
                </span>
              </Link>
            </div>
            <CardTitle className="text-3xl !mt-2">
              <TranslatedContent content={post.title} />
            </CardTitle>
            <div className="flex items-center gap-4 pt-2 text-sm">
              <div className="flex items-center gap-2">
                <UserAvatar user={post.author} />
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-muted-foreground">
                    Posted {post.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
             <TranslatedContent content={post.content} />
             {post.type === "Poll" && <Poll post={post} />}
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Button variant={vote === 'up' ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => handleVote("up")}>
                  <ThumbsUp className="h-4 w-4" />
                  <span>{voteCount}</span>
                </Button>
                <Button variant={vote === 'down' ? 'destructive' : 'outline'} size="icon" className="h-9 w-9" onClick={() => handleVote("down")}>
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">
                    {post.commentCount} Comments
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleBookmark}>
                  <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current text-primary")} />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">
              {post.commentCount} Comments
            </h2>
            <div className="flex items-center gap-2">
              {post.commentCount > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BrainCircuit className="mr-2 h-4 w-4" />
                  )}
                  Summarize
                </Button>
              )}
            </div>
          </div>

          {summary && (
            <Alert>
              <BrainCircuit className="h-4 w-4" />
              <AlertTitle>Discussion Summary</AlertTitle>
              <AlertDescription>{summary}</AlertDescription>
            </Alert>
          )}

          {sortedComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave a comment</CardTitle>
          </CardHeader>
          <CardContent className="flex items-start gap-4">
            <UserAvatar user={mockCurrentUser} />
            <div className="flex-1 space-y-4">
              <Textarea placeholder="Add your comment..." rows={4} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
              <Button onClick={handlePostComment}>Post Comment</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-4 sticky top-24">
        <Card>
          <CardHeader>
            <CardTitle>Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <UserAvatar user={post.author} className="h-12 w-12" />
              <div>
                <div className="font-bold">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  {post.author.title}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {post.author.reputation.toLocaleString()} Reputation
            </p>
          </CardContent>
        </Card>

        {post.linkedTask && (
          <Card>
            <CardHeader>
              <CardTitle>Linked Task</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 h-auto">
                {post.linkedTask}
              </Button>
            </CardContent>
          </Card>
        )}

        {post.linkedSkill && (
          <Card>
            <CardHeader>
              <CardTitle>Related Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 h-auto">
                {post.linkedSkill}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
