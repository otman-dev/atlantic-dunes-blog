import { NextRequest, NextResponse } from 'next/server';
import { readCategories, writeCategories } from '@/lib/utils/fileSystem';
import { Category } from '@/lib/types';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const categories = await readCategories();
    const category = categories.find((c: Category) => c.id.toString() === id);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error reading category:', error);
    return NextResponse.json({ error: 'Failed to read category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;    const updates = await request.json();
    const categories = await readCategories();
    
    const categoryIndex = categories.findIndex((c: Category) => c.id.toString() === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...updates,
      id: id // Ensure ID doesn't change
    };
    
    await writeCategories(categories);
    return NextResponse.json(categories[categoryIndex]);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {    const { id } = await params;
    const categories = await readCategories();
    
    const categoryIndex = categories.findIndex((c: Category) => c.id.toString() === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    categories.splice(categoryIndex, 1);
    await writeCategories(categories);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
