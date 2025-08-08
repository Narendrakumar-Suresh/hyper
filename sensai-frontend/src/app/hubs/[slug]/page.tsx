
'use client';

import { useState } from 'react';
import { mockHubs, mockPosts, mockStudyGroups } from '@/lib/data';
import { notFound, useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Rss, Star, Users, X, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { StudyGroupCard } from '@/components/StudyGroupCard';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function HubPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const selectedTag = searchParams.get('tag');

  const [isFollowing, setIsFollowing] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const hub = mockHubs.find((h) => h.slug === params.slug);
  if (!hub) {
    notFound();
  }
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
        title: isFollowing ? `Unfollowed ${hub.name}` : `Followed ${hub.name}!`,
        description: isFollowing ? "You won't see their posts in your feed." : "Their posts will now appear in your 'For You' feed.",
    });
  }
  
  const handleJoin = () => {
    setIsJoining(!isJoining);
     toast({
        title: isJoining ? `Left ${hub.name}` : `Joined ${hub.name}!`,
        description: isJoining ? "You have left the hub." : "You are now a member of this hub.",
    });
  }

  const handleTagClick = (tag: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (tag) {
      current.set('tag', tag);
    } else {
      current.delete('tag');
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const allPosts = mockPosts.filter((p) => p.hub.id === hub.id);

  const filteredPosts = selectedTag
    ? allPosts.filter(p => p.tags.some(t => t.name === selectedTag))
    : allPosts;

  const questions = filteredPosts.filter(p => p.type === 'Question');
  const notes = filteredPosts.filter(p => p.type === 'Note');
  const polls = filteredPosts.filter(p => p.type === 'Poll');

  const studyGroups = mockStudyGroups.filter(sg => sg.hubId === hub.id);

  const getActiveTab = () => {
    if (questions.length > 0) return 'questions';
    if (notes.length > 0) return 'notes';
    if (polls.length > 0) return 'polls';
    return 'all';
  };
  const [activeTab, setActiveTab] = useState(getActiveTab());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-4 rounded-lg flex-shrink-0">
                            <hub.icon className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl tracking-tight">{hub.name}</CardTitle>
                            <CardDescription className="mt-1">{hub.description}</CardDescription>
                        </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
                        <Button onClick={handleFollow}>
                            {isFollowing ? <Check className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                            {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                        <Button variant="outline" size="icon">
                            <Rss className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {selectedTag && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg py-1 px-3">
                  Filtering by tag: {selectedTag}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => handleTagClick(null)} className="h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                <TabsTrigger value="all">All ({filteredPosts.length})</TabsTrigger>
                <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
                <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
                <TabsTrigger value="polls">Polls ({polls.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                    {filteredPosts.length > 0 ? filteredPosts.map((post) => <PostCard key={post.id} post={post} onTagClick={handleTagClick} />) : <p className="text-muted-foreground text-center py-8">No posts in this hub yet.</p>}
                </div>
                </TabsContent>
                <TabsContent value="questions" className="mt-6">
                <div className="space-y-4">
                     {questions.length > 0 ? questions.map((post) => <PostCard key={post.id} post={post} onTagClick={handleTagClick}/>) : <p className="text-muted-foreground text-center py-8">No questions with this tag.</p>}
                </div>
                </TabsContent>
                <TabsContent value="notes" className="mt-6">
                <div className="space-y-4">
                     {notes.length > 0 ? notes.map((post) => <PostCard key={post.id} post={post} onTagClick={handleTagClick} />) : <p className="text-muted-foreground text-center py-8">No notes with this tag.</p>}
                </div>
                </TabsContent>
                <TabsContent value="polls" className="mt-6">
                <div className="space-y-4">
                     {polls.length > 0 ? polls.map((post) => <PostCard key={post.id} post={post} onTagClick={handleTagClick} />) : <p className="text-muted-foreground text-center py-8">No polls with this tag.</p>}
                </div>
                </TabsContent>
            </Tabs>
        </div>
        <div className="lg:col-span-1 space-y-4 sticky top-24">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">About {hub.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{hub.memberCount.toLocaleString()} members • {hub.postCount} posts</p>
                    <Button className="w-full" onClick={handleJoin}>
                       {isJoining ? <Check className="mr-2 h-4 w-4" /> : null}
                       {isJoining ? 'Joined' : 'Join Hub'}
                    </Button>
                </CardContent>
            </Card>

            {studyGroups.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="text-primary"/>
                            Study Groups
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {studyGroups.map(group => <StudyGroupCard key={group.id} group={group} />)}
                        <Separator />
                        <Button variant="outline" className="w-full">Create a new group</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
