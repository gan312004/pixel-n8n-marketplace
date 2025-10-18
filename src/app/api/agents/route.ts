import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agents } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = db.select().from(agents);
    const conditions = [];

    if (type && type !== 'All') {
      conditions.push(eq(agents.type, type));
    }

    if (search) {
      conditions.push(
        or(
          like(agents.name, `%${search}%`),
          like(agents.description, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query.orderBy(desc(agents.createdAt)).limit(limit).offset(offset);

    let countQuery = db.select().from(agents);
    if (conditions.length > 0) {
      countQuery = countQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    const countResult = await countQuery;
    const count = countResult.length;

    return NextResponse.json({
      success: true,
      data: results,
      count
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