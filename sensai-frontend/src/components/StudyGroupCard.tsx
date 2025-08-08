import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import Link from 'next/link';
import type { StudyGroup } from '@/lib/types';
import { cn } from "@/lib/utils";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export function StudyGroupCard({ group }: { group: StudyGroup }) {
  const { id, name, description, memberCount, avatarUrl } = group;

  return (
    <Card className={cn(
        "transition-all duration-300 ease-in-out",
        "hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
    )}>
        <CardHeader>
            <div className="flex items-center justify-between">
                <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                    <AvatarImage src={avatarUrl} alt={name} data-ai-hint="group logo" />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Link href={`/study-groups/${id}`} passHref>
                    <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </Link>
            </div>
        </CardHeader>
        <CardContent>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="mt-1 text-sm">{description}</CardDescription>
        </CardContent>
        <CardFooter>
             <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-1.5" />
                <span>{memberCount} members</span>
            </div>
        </CardFooter>
    </Card>
  );
}
