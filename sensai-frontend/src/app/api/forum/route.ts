import { NextResponse } from 'next/server';
import { forumAPI } from '@/lib/api/forum';

// Helper function to handle API errors
function handleError(error: unknown) {
  console.error('API Error:', error);
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}

// GET /api/forum/hubs
export async function GET() {
  try {
    const hubs = await forumAPI.getHubs();
    return NextResponse.json(hubs);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/forum/hubs
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newHub = await forumAPI.createHub(data);
    return NextResponse.json(newHub, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
