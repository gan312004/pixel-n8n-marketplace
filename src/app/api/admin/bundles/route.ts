import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bundles, session, user } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

async function validateAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, isAdmin: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.substring(7);

  try {
    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return { authenticated: false, isAdmin: false, error: 'Invalid or expired session' };
    }

    const sessionData = sessionRecord[0];
    
    if (new Date(sessionData.expiresAt) < new Date()) {
      return { authenticated: false, isAdmin: false, error: 'Session expired' };
    }

    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, sessionData.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return { authenticated: false, isAdmin: false, error: 'User not found' };
    }

    const userData = userRecord[0];

    return {
      authenticated: true,
      isAdmin: userData.isAdmin || false,
      userId: userData.id,
      user: userData
    };
  } catch (error) {
    console.error('Auth validation error:', error);
    return { authenticated: false, isAdmin: false, error: 'Authentication failed' };
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const auth = await validateAdminAuth(request);

    if (!auth.authenticated) {
      return NextResponse.json({
        success: false,
        error: auth.error || 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      }, { status: 401 });
    }

    if (!auth.isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Admin access required',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, originalPrice, bundlePrice, discount, templates: templatesData, saves, image } = body;

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Name is required',
        code: 'MISSING_NAME'
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({
        success: false,
        error: 'Description is required',
        code: 'MISSING_DESCRIPTION'
      }, { status: 400 });
    }

    if (originalPrice === undefined || originalPrice === null) {
      return NextResponse.json({
        success: false,
        error: 'Original price is required',
        code: 'MISSING_ORIGINAL_PRICE'
      }, { status: 400 });
    }

    if (bundlePrice === undefined || bundlePrice === null) {
      return NextResponse.json({
        success: false,
        error: 'Bundle price is required',
        code: 'MISSING_BUNDLE_PRICE'
      }, { status: 400 });
    }

    if (discount === undefined || discount === null) {
      return NextResponse.json({
        success: false,
        error: 'Discount is required',
        code: 'MISSING_DISCOUNT'
      }, { status: 400 });
    }

    if (!templatesData) {
      return NextResponse.json({
        success: false,
        error: 'Templates are required',
        code: 'MISSING_TEMPLATES'
      }, { status: 400 });
    }

    if (saves === undefined || saves === null) {
      return NextResponse.json({
        success: false,
        error: 'Saves is required',
        code: 'MISSING_SAVES'
      }, { status: 400 });
    }

    if (!Array.isArray(templatesData)) {
      return NextResponse.json({
        success: false,
        error: 'Templates must be an array',
        code: 'INVALID_TEMPLATES_FORMAT'
      }, { status: 400 });
    }

    if (typeof originalPrice !== 'number' || originalPrice <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Original price must be a positive integer',
        code: 'INVALID_ORIGINAL_PRICE'
      }, { status: 400 });
    }

    if (typeof bundlePrice !== 'number' || bundlePrice <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Bundle price must be a positive integer',
        code: 'INVALID_BUNDLE_PRICE'
      }, { status: 400 });
    }

    if (typeof discount !== 'number' || discount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Discount must be a positive integer',
        code: 'INVALID_DISCOUNT'
      }, { status: 400 });
    }

    if (typeof saves !== 'number' || saves <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Saves must be a positive integer',
        code: 'INVALID_SAVES'
      }, { status: 400 });
    }

    if (bundlePrice >= originalPrice) {
      return NextResponse.json({
        success: false,
        error: 'Bundle price must be less than original price',
        code: 'INVALID_PRICE_RELATION'
      }, { status: 400 });
    }

    const newBundle = await db.insert(bundles)
      .values({
        name: name.trim(),
        description: description.trim(),
        originalPrice,
        bundlePrice,
        discount,
        templates: JSON.stringify(templatesData),
        saves,
        image: image || null,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newBundle[0],
      message: 'Bundle created successfully'
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