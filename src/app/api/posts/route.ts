import { NextRequest, NextResponse } from 'next/server';
import { getAllPublishedPosts, getPostsByCategory } from '@/lib/services/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let posts;
    if (category && category !== 'all') {
      posts = await getPostsByCategory(category);
    } else {
      posts = await getAllPublishedPosts();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
