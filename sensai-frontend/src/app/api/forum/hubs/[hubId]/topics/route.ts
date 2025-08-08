import { NextResponse } from 'next/server';
import { forumAPI } from '@/lib/api/forum';

// GET /api/forum/hubs/[hubId]/topics
export async function GET(
  request: Request,
  { params }: { params: { hubId: string } }
) {
  try {
    const topics = await forumAPI.getTopics(params.hubId);
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

// POST /api/forum/hubs/[hubId]/topics
export async function POST(
  request: Request,
  { params }: { params: { hubId: string } }
) {
  try {
    const data = await request.json();
    const newTopic = await forumAPI.createTopic(params.hubId, data);
    return NextResponse.json(newTopic, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
