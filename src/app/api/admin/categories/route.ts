import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCategories,
  getCategoryById,
  getCategoryBySlug
} from '@/lib/services/queries';
import { 
  createCategory as createCategoryMutation,
  updateCategory as updateCategoryMutation,
  deleteCategory as deleteCategoryMutation
} from '@/lib/services/mutations';
import { getPostStats } from '@/lib/services/analytics';
import { requireAdminAuth } from '@/lib/services/session';

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const statsRequested = searchParams.get('stats') === 'true';
    
    let responseData: any = {};
    
    // Get categories
    if (id) {
      responseData.category = await getCategoryById(id);
    } else if (slug) {
      responseData.category = await getCategoryBySlug(slug);
    } else {
      responseData.categories = await getAllCategories();
    }
    
    // Get stats if requested
    if (statsRequested) {
      responseData.stats = await getPostStats();
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching categories:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }    
    const newCategory = await createCategoryMutation(body);
    
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const updatedCategory = await updateCategoryMutation(id, body);
    
    if (!updatedCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteCategoryMutation(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Category not found or could not be deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
