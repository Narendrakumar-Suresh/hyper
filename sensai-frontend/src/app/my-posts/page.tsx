import { PostCard } from '@/components/PostCard';
import { mockCurrentUser, mockPosts } from '@/lib/data';

export default function MyPostsPage() {
  const myPosts = mockPosts.filter(
    (post) => post.author.id === mockCurrentUser.id
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
        <p className="text-muted-foreground">
          A collection of all your contributions to the community.
        </p>
      </div>

      <div className="space-y-4">
        {myPosts.length > 0 ? (
          myPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No posts yet!</h2>
            <p className="mt-2 text-muted-foreground">
              Create your first post to start sharing and learning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
