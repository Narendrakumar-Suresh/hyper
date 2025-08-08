
import { notFound } from 'next/navigation';
import { mockStudyGroups, mockPosts } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';
import { PostCard } from '@/components/PostCard';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function StudyGroupPage({ params }: { params: { id: string } }) {
  const group = mockStudyGroups.find((g) => g.id === params.id);

  if (!group) {
    notFound();
  }

  const groupPosts = mockPosts.filter((p) => p.studyGroupId === group.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-4 ring-primary/50">
                  <AvatarImage src={group.avatarUrl} alt={group.name} data-ai-hint="group logo" />
                  <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl tracking-tight">{group.name}</CardTitle>
                  <CardDescription className="mt-1">{group.description}</CardDescription>
                   <p className="text-sm text-muted-foreground mt-2">{group.memberCount} members</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Join Group
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Group Feed</h2>
             {groupPosts.length > 0 ? (
                groupPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold">No posts yet!</h2>
                    <p className="mt-2 text-muted-foreground">
                        Be the first to start a discussion in this group.
                    </p>
                </div>
            )}
        </div>
      </div>

      <div className="lg:col-span-1 space-y-4 sticky top-24">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.members.map(member => (
              <div key={member.id} className="flex items-center gap-3">
                 <UserAvatar user={member} className="h-10 w-10" />
                 <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.title}</p>
                 </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
