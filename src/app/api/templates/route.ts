import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const featuredParam = searchParams.get('featured');
    const search = searchParams.get('search');

    let query = db.select().from(templates);
    const conditions = [];

    if (category && category !== 'All') {
      conditions.push(eq(templates.category, category));
    }

    if (featuredParam !== null && featuredParam === 'true') {
      conditions.push(eq(templates.featured, true));
    }

    if (search) {
      conditions.push(
        or(
          like(templates.name, `%${search}%`),
          like(templates.description, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query
      .orderBy(desc(templates.createdAt))
      .limit(limit)
      .offset(offset);

    let countQuery = db.select().from(templates);
    if (conditions.length > 0) {
      countQuery = countQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    const countResults = await countQuery;
    const totalCount = countResults.length;

    return NextResponse.json({
      success: true,
      data: results,
      count: totalCount
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newTemplate = {
      id: Date.now(),
      ...body,
      rating: 0,
      downloads: 0,
      featured: false,
    }

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully',
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create template',
    }, { status: 500 })
  }
}