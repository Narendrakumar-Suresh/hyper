
import { mockPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PostPageClient } from './PostPageClient';

export default function PostPage({ params }: { params: { id: string } }) {
  const post = mockPosts.find((p) => p.id === params.id);
  
  if (!post) {
    notFound();
  }

  return <PostPageClient post={post} />;
}
