
'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { UserAvatar } from "./UserAvatar";
import type { Comment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { TranslatedContent } from "./TranslatedContent";

export function CommentCard({ comment: initialComment }: { comment: Comment; }) {
    const [comment, setComment] = useState(initialComment);
    const [vote, setVote] = useState<"up" | "down" | null>(null);

    const handleVote = (type: "up" | "down") => {
        if (vote === type) {
            setVote(null);
            setComment(c => ({...c, upvotes: type === "up" ? c.upvotes - 1 : c.upvotes, downvotes: type === "down" ? c.downvotes - 1 : c.downvotes }));

        } else {
            let newUpvotes = comment.upvotes;
            let newDownvotes = comment.downvotes;

            if(vote === 'up') newUpvotes--;
            if(vote === 'down') newDownvotes--;
            
            if(type === 'up') newUpvotes++;
            if(type === 'down') newDownvotes++;
            
            setVote(type);
            setComment(c => ({...c, upvotes: newUpvotes, downvotes: newDownvotes}));
        }
    }

    const voteCount = comment.upvotes - comment.downvotes;

    return (
        <div className="flex items-start gap-4">
            <UserAvatar user={comment.author} className="mt-1" />
            <div className="flex-1">
                <Card className={cn(
                    "transition-all",
                    comment.isAcceptedAnswer && "border-green-500/50 bg-green-500/10"
                )}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <p className="font-semibold">{comment.author.name}</p>
                                <p className="text-sm text-muted-foreground">• {comment.createdAt}</p>
                            </div>
                            {comment.isAcceptedAnswer && (
                                <Badge className="bg-green-500/80 text-white hover:bg-green-500/90">
                                    <Award className="mr-1 h-4 w-4" />
                                    Accepted Answer
                                </Badge>
                            )}
                        </div>
                        <div className="text-muted-foreground prose prose-sm max-w-none">
                            <TranslatedContent content={comment.content} />
                        </div>

                         <div className="flex items-center justify-end gap-2 mt-4">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleVote('up')}>
                                <ThumbsUp className={cn("h-4 w-4", vote === 'up' && 'text-primary')} />
                                <span>{voteCount}</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleVote('down')}>
                                <ThumbsDown className={cn("h-4 w-4", vote === 'down' && 'text-destructive')} />
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
