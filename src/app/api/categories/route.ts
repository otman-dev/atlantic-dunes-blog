import { NextRequest, NextResponse } from 'next/server';
import { readCategories, writeCategories } from '@/lib/utils/fileSystem';

export async function GET() {
  try {
    const categories = await readCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error reading categories:', error);
    return NextResponse.json({ error: 'Failed to read categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const categoryData = await request.json();
    const categories = await readCategories();
    
    // Generate a new ID that's one higher than the highest existing ID
    const maxId = categories.length > 0 ? Math.max(...categories.map((c: any) => parseInt(c.id) || 0)) : 0;
    const newCategory = {
      ...categoryData,
      id: (maxId + 1).toString()
    };
    
    categories.push(newCategory);
    await writeCategories(categories);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
