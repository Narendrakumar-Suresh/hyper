import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, MessageCircle, BookOpen, User } from "lucide-react";
import Link from 'next/link';
import type { Hub } from '@/lib/types';
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface HubCardProps {
  hub: Hub & {
    isCourse?: boolean;
    creator_avatar?: string;
    banner_url?: string;
  };
}

export function HubCard({ hub }: HubCardProps) {
  const { 
    slug, 
    name, 
    description, 
    icon: Icon = BookOpen, 
    postCount = 0, 
    memberCount = 0,
    isCourse = false,
    creator_avatar,
    banner_url
  } = hub;

  return (
    <Link href={isCourse ? `/courses/${slug.replace('course_', '')}` : `/hubs/${slug}`} className="block group">
      <Card className={cn(
        "h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        "hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
      )}>
        {banner_url && (
          <div className="h-32 relative">
            <Image 
              src={banner_url} 
              alt={`${name} banner`} 
              fill 
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className={cn(banner_url ? "pt-4" : "")}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-3 rounded-lg flex-shrink-0",
                isCourse ? "bg-primary/10" : "bg-muted"
              )}>
                {creator_avatar ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src={creator_avatar} 
                      alt="Creator" 
                      width={40} 
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                {isCourse && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Course
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors mt-2" />
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-2">{description || 'No description provided'}</CardDescription>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span>{postCount} {postCount === 1 ? 'post' : 'posts'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{memberCount.toLocaleString()} members</span>
              </div>
            </div>
            {isCourse && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                View Course
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
