import { NextResponse } from 'next/server';
import { forumAPI } from '@/lib/api/forum';

// GET /api/forum/hubs/[hubId]
export async function GET(
  request: Request,
  { params }: { params: { hubId: string } }
) {
  try {
    const hub = await forumAPI.getHub(params.hubId);
    return NextResponse.json(hub);
  } catch (error) {
    console.error('Error fetching hub:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hub' },
      { status: 500 }
    );
  }
}
