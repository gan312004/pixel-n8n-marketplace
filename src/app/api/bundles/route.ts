import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bundles } from '@/db/schema';
import { like, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(bundles).orderBy(desc(bundles.createdAt));

    if (search) {
      const searchCondition = or(
        like(bundles.name, `%${search}%`),
        like(bundles.description, `%${search}%`)
      );
      query = db.select().from(bundles).where(searchCondition).orderBy(desc(bundles.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    const countQuery = search
      ? db.select().from(bundles).where(or(
          like(bundles.name, `%${search}%`),
          like(bundles.description, `%${search}%`)
        ))
      : db.select().from(bundles);
    
    const countResult = await countQuery;
    const totalCount = countResult.length;

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
    const { bundleId, userId } = body

    const bundleData = {
      id: `bundle_purchase_${Date.now()}`,
      userId,
      bundleId,
      amount: 179,
      status: 'completed',
      purchasedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: bundleData,
      message: 'Bundle purchased successfully',
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Purchase failed',
    }, { status: 500 })
  }
}