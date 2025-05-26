import { NextRequest, NextResponse } from 'next/server';
import { readPosts, writePosts } from '@/lib/utils/fileSystem';
import { Post } from '@/lib/types';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const posts = await readPosts();
    const post = posts.find((p: Post) => p.id === id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json({ error: 'Failed to read post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const posts = await readPosts();
    
    const postIndex = posts.findIndex((p: Post) => p.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    posts[postIndex] = {
      ...posts[postIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    await writePosts(posts);
    return NextResponse.json(posts[postIndex]);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const posts = await readPosts();
    
    const postIndex = posts.findIndex((p: Post) => p.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    posts.splice(postIndex, 1);
    await writePosts(posts);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
