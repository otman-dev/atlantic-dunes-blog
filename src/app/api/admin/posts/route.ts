import { NextRequest, NextResponse } from 'next/server';
import { getPostById, getAllPosts } from '@/lib/services/queries';
import { createPost, updatePost, deletePost } from '@/lib/services/mutations';
import { requireAdminAuth } from '@/lib/services/session';

// GET /api/admin/posts - Get all posts or a specific post by ID
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const post = await getPostById(id);
      
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(post);
    } else {
      const posts = await getAllPosts();
      return NextResponse.json(posts);
    }  } catch (error) {
    console.error('Error fetching posts:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const postData = await request.json();
    
    // Validate required fields
    if (!postData.title || !postData.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const newPost = await createPost(postData);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts?id=123 - Update a post
export async function PUT(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const updates = await request.json();
    const updatedPost = await updatePost(id, updates);    
    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts?id=123 - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deletePost(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Post not found or could not be deleted' },
        { status: 404 }
      );
    }
      return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
