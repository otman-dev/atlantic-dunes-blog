import { NextRequest, NextResponse } from 'next/server';
import { readPosts, writePosts } from '@/lib/utils/fileSystem';
import { Post } from '@/lib/types';

export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const postData = await request.json();
    const posts = await readPosts();
    
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    posts.push(newPost);
    await writePosts(posts);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
