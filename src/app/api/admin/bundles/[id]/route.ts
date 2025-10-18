import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bundles, session, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

async function authenticateAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Authentication required', status: 401 };
    }

    const token = authHeader.substring(7);
    if (!token) {
      return { error: 'Authentication required', status: 401 };
    }

    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return { error: 'Invalid authentication token', status: 401 };
    }

    const sessionData = sessionRecord[0];
    if (new Date(sessionData.expiresAt) < new Date()) {
      return { error: 'Session expired', status: 401 };
    }

    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, sessionData.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return { error: 'User not found', status: 401 };
    }

    const userData = userRecord[0];
    if (!userData.isAdmin) {
      return { error: 'Admin access required', status: 403 };
    }

    return { user: userData };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateAdmin(request);
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error, code: 'AUTH_ERROR' },
        { status: auth.status }
      );
    }

    const params = await context.params;
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if ('id' in body || 'createdAt' in body) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot update id or createdAt fields',
          code: 'FORBIDDEN_FIELD_UPDATE',
        },
        { status: 400 }
      );
    }

    if (body.templates !== undefined) {
      if (!Array.isArray(body.templates)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Templates must be an array',
            code: 'INVALID_TEMPLATES',
          },
          { status: 400 }
        );
      }
    }

    if (body.originalPrice !== undefined) {
      if (!Number.isInteger(body.originalPrice) || body.originalPrice < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Original price must be a positive integer',
            code: 'INVALID_ORIGINAL_PRICE',
          },
          { status: 400 }
        );
      }
    }

    if (body.bundlePrice !== undefined) {
      if (!Number.isInteger(body.bundlePrice) || body.bundlePrice < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Bundle price must be a positive integer',
            code: 'INVALID_BUNDLE_PRICE',
          },
          { status: 400 }
        );
      }
    }

    if (body.discount !== undefined) {
      if (!Number.isInteger(body.discount) || body.discount < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Discount must be a positive integer',
            code: 'INVALID_DISCOUNT',
          },
          { status: 400 }
        );
      }
    }

    if (body.saves !== undefined) {
      if (!Number.isInteger(body.saves) || body.saves < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Saves must be a positive integer',
            code: 'INVALID_SAVES',
          },
          { status: 400 }
        );
      }
    }

    const existingBundle = await db.select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))
      .limit(1);

    if (existingBundle.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bundle not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const currentBundle = existingBundle[0];
    const finalOriginalPrice = body.originalPrice !== undefined ? body.originalPrice : currentBundle.originalPrice;
    const finalBundlePrice = body.bundlePrice !== undefined ? body.bundlePrice : currentBundle.bundlePrice;

    if (finalBundlePrice >= finalOriginalPrice) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bundle price must be less than original price',
          code: 'INVALID_PRICE_RELATIONSHIP',
        },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice;
    if (body.bundlePrice !== undefined) updateData.bundlePrice = body.bundlePrice;
    if (body.discount !== undefined) updateData.discount = body.discount;
    if (body.templates !== undefined) updateData.templates = body.templates;
    if (body.saves !== undefined) updateData.saves = body.saves;
    if (body.image !== undefined) updateData.image = body.image;

    const updated = await db.update(bundles)
      .set(updateData)
      .where(eq(bundles.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bundle not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updated[0],
        message: 'Bundle updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateAdmin(request);
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, error: auth.error, code: 'AUTH_ERROR' },
        { status: auth.status }
      );
    }

    const params = await context.params;
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingBundle = await db.select()
      .from(bundles)
      .where(eq(bundles.id, parseInt(id)))
      .limit(1);

    if (existingBundle.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bundle not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(bundles)
      .where(eq(bundles.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bundle not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bundle deleted successfully',
        data: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}