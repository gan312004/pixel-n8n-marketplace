import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, session, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

async function authenticateAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, isAdmin: false, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.substring(7);

    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return { authenticated: false, isAdmin: false, error: 'Invalid session token' };
    }

    const userSession = sessionRecord[0];

    if (new Date(userSession.expiresAt) < new Date()) {
      return { authenticated: false, isAdmin: false, error: 'Session expired' };
    }

    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, userSession.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return { authenticated: false, isAdmin: false, error: 'User not found' };
    }

    const currentUser = userRecord[0];

    if (!currentUser.isAdmin) {
      return { authenticated: true, isAdmin: false, error: 'Admin privileges required' };
    }

    return { authenticated: true, isAdmin: true, userId: currentUser.id };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, isAdmin: false, error: 'Authentication failed' };
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error, code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: auth.error, code: 'FORBIDDEN' },
        { status: 403 }
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

    const templateId = parseInt(id);

    const existingTemplate = await db.select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    if ('id' in body || 'createdAt' in body) {
      return NextResponse.json(
        { success: false, error: 'Cannot update id or createdAt fields', code: 'FORBIDDEN_FIELD_UPDATE' },
        { status: 400 }
      );
    }

    if (body.features !== undefined) {
      if (!Array.isArray(body.features)) {
        return NextResponse.json(
          { success: false, error: 'Features must be an array', code: 'INVALID_FEATURES_FORMAT' },
          { status: 400 }
        );
      }
    }

    if (body.requirements !== undefined) {
      if (!Array.isArray(body.requirements)) {
        return NextResponse.json(
          { success: false, error: 'Requirements must be an array', code: 'INVALID_REQUIREMENTS_FORMAT' },
          { status: 400 }
        );
      }
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price < 0 || !Number.isInteger(body.price)) {
        return NextResponse.json(
          { success: false, error: 'Price must be a positive integer', code: 'INVALID_PRICE' },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, any> = {};

    const allowedFields = ['name', 'category', 'price', 'rating', 'downloads', 'description', 'featured', 'features', 'requirements', 'image'];
    
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    const updated = await db.update(templates)
      .set(updateData)
      .where(eq(templates.id, templateId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update template', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updated[0],
        message: 'Template updated successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + error },
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

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error, code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    if (!auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: auth.error, code: 'FORBIDDEN' },
        { status: 403 }
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

    const templateId = parseInt(id);

    const existingTemplate = await db.select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Template not found', code: 'TEMPLATE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(templates)
      .where(eq(templates.id, templateId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete template', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Template deleted successfully',
        data: deleted[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}