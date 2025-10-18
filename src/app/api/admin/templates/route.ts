import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, session, user } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

async function authenticateAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return null;
    }

    const sessionData = sessionRecord[0];

    if (new Date(sessionData.expiresAt) < new Date()) {
      return null;
    }

    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, sessionData.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return null;
    }

    return userRecord[0];
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

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

    if (category) {
      conditions.push(eq(templates.category, category));
    }

    if (featuredParam !== null) {
      const featured = featuredParam === 'true';
      conditions.push(eq(templates.featured, featured));
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

export async function POST(request: NextRequest) {
  try {
    const authenticatedUser = await authenticateAdmin(request);

    if (!authenticatedUser) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    if (!authenticatedUser.isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Admin access required',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, category, price, description, features, requirements, featured, image } = body;

    if (!name || !category || price === undefined || !description || !features || !requirements) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, category, price, description, features, requirements',
        code: 'MISSING_REQUIRED_FIELDS'
      }, { status: 400 });
    }

    if (!Array.isArray(features)) {
      return NextResponse.json({
        success: false,
        error: 'Features must be an array',
        code: 'INVALID_FEATURES_FORMAT'
      }, { status: 400 });
    }

    if (!Array.isArray(requirements)) {
      return NextResponse.json({
        success: false,
        error: 'Requirements must be an array',
        code: 'INVALID_REQUIREMENTS_FORMAT'
      }, { status: 400 });
    }

    const priceInt = parseInt(price);
    if (isNaN(priceInt) || priceInt < 0) {
      return NextResponse.json({
        success: false,
        error: 'Price must be a positive integer',
        code: 'INVALID_PRICE'
      }, { status: 400 });
    }

    const newTemplate = await db.insert(templates)
      .values({
        name: name.trim(),
        category: category.trim(),
        price: priceInt,
        description: description.trim(),
        features: JSON.stringify(features),
        requirements: JSON.stringify(requirements),
        rating: 0,
        downloads: 0,
        featured: featured === true,
        image: image || null,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newTemplate[0],
      message: 'Template created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}