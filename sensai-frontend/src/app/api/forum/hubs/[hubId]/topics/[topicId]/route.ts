import { NextResponse } from 'next/server';
import { forumAPI } from '@/lib/api/forum';

// GET /api/forum/hubs/[hubId]/topics/[topicId]
export async function GET(
  request: Request,
  { params }: { params: { hubId: string; topicId: string } }
) {
  try {
    const topicData = await forumAPI.getTopic(params.hubId, params.topicId);
    return NextResponse.json(topicData);
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

// POST /api/forum/hubs/[hubId]/topics/[topicId]/posts
export async function POST(
  request: Request,
  { params }: { params: { hubId: string; topicId: string } }
) {
  try {
    const data = await request.json();
    const newPost = await forumAPI.createPost(params.hubId, params.topicId, data);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
