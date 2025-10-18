import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agents, session, user } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

async function getAdminUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return null;
    }

    const currentSession = sessionRecord[0];
    
    if (new Date(currentSession.expiresAt) < new Date()) {
      return null;
    }

    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, currentSession.userId))
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
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = db.select().from(agents);
    const conditions = [];

    if (type) {
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

export async function POST(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request);

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    if (!adminUser.isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Admin access required',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, type, price, description, features, requirements, image } = body;

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Name is required',
        code: 'MISSING_NAME'
      }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({
        success: false,
        error: 'Type is required',
        code: 'MISSING_TYPE'
      }, { status: 400 });
    }

    if (price === undefined || price === null) {
      return NextResponse.json({
        success: false,
        error: 'Price is required',
        code: 'MISSING_PRICE'
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({
        success: false,
        error: 'Description is required',
        code: 'MISSING_DESCRIPTION'
      }, { status: 400 });
    }

    if (!features) {
      return NextResponse.json({
        success: false,
        error: 'Features are required',
        code: 'MISSING_FEATURES'
      }, { status: 400 });
    }

    if (!requirements) {
      return NextResponse.json({
        success: false,
        error: 'Requirements are required',
        code: 'MISSING_REQUIREMENTS'
      }, { status: 400 });
    }

    if (!Array.isArray(features)) {
      return NextResponse.json({
        success: false,
        error: 'Features must be an array',
        code: 'INVALID_FEATURES'
      }, { status: 400 });
    }

    if (!Array.isArray(requirements)) {
      return NextResponse.json({
        success: false,
        error: 'Requirements must be an array',
        code: 'INVALID_REQUIREMENTS'
      }, { status: 400 });
    }

    const parsedPrice = parseInt(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({
        success: false,
        error: 'Price must be a positive integer',
        code: 'INVALID_PRICE'
      }, { status: 400 });
    }

    const newAgent = await db.insert(agents).values({
      name: name.trim(),
      type: type.trim(),
      price: parsedPrice,
      description: description.trim(),
      features: JSON.stringify(features),
      requirements: JSON.stringify(requirements),
      image: image ? image.trim() : null,
      rating: 0,
      downloads: 0,
      createdAt: new Date().toISOString()
    }).returning();

    return NextResponse.json({
      success: true,
      data: newAgent[0],
      message: 'Agent created successfully'
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