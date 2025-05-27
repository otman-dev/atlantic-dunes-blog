import { NextResponse } from 'next/server';
import { getAllPosts, getAllCategories } from '@/lib/services/queries';
import { getDashboardAnalytics } from '@/lib/services/analytics';
import { initializeDatabase } from '@/lib/mongodb';
import { requireAdminAuth } from '@/lib/services/session';

export async function GET() {
  try {
    // Require admin authentication
    await requireAdminAuth();
    
    // Initialize database if needed
    await initializeDatabase();
    
    // Fetch all dashboard data
    const [posts, categories, analytics] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
      getDashboardAnalytics()
    ]);

    return NextResponse.json({
      posts,
      categories,
      analytics
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
