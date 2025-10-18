import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agents, session, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

async function authenticateAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, error: 'Missing or invalid authorization header', status: 401 };
    }

    const token = authHeader.substring(7);

    const sessionRecord = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionRecord.length === 0) {
      return { authenticated: false, error: 'Invalid or expired session', status: 401 };
    }

    const sessionData = sessionRecord[0];

    if (new Date(sessionData.expiresAt) < new Date()) {
      return { authenticated: false, error: 'Session expired', status: 401 };
    }

    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, sessionData.userId))
      .limit(1);

    if (userRecord.length === 0) {
      return { authenticated: false, error: 'User not found', status: 401 };
    }

    const userData = userRecord[0];

    if (!userData.isAdmin) {
      return { authenticated: false, error: 'Admin access required', status: 403 };
    }

    return { authenticated: true, user: userData };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Authentication failed', status: 500 };
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { 
          success: false, 
          error: authResult.error,
          code: authResult.status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED'
        },
        { status: authResult.status }
      );
    }

    const params = await context.params;
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid agent ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const agentId = parseInt(id);

    const existingAgent = await db.select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (existingAgent.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Agent not found',
          code: 'AGENT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if ('id' in body) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cannot update agent ID',
          code: 'INVALID_UPDATE_FIELD'
        },
        { status: 400 }
      );
    }

    if ('createdAt' in body) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cannot update createdAt field',
          code: 'INVALID_UPDATE_FIELD'
        },
        { status: 400 }
      );
    }

    if ('price' in body) {
      const price = parseInt(body.price);
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Price must be a positive integer',
            code: 'INVALID_PRICE'
          },
          { status: 400 }
        );
      }
      body.price = price;
    }

    if ('features' in body) {
      if (!Array.isArray(body.features)) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Features must be an array',
            code: 'INVALID_FEATURES_FORMAT'
          },
          { status: 400 }
        );
      }
      body.features = JSON.stringify(body.features);
    }

    if ('requirements' in body) {
      if (!Array.isArray(body.requirements)) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Requirements must be an array',
            code: 'INVALID_REQUIREMENTS_FORMAT'
          },
          { status: 400 }
        );
      }
      body.requirements = JSON.stringify(body.requirements);
    }

    if ('rating' in body) {
      const rating = parseFloat(body.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Rating must be between 0 and 5',
            code: 'INVALID_RATING'
          },
          { status: 400 }
        );
      }
      body.rating = rating;
    }

    if ('downloads' in body) {
      const downloads = parseInt(body.downloads);
      if (isNaN(downloads) || downloads < 0) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Downloads must be a non-negative integer',
            code: 'INVALID_DOWNLOADS'
          },
          { status: 400 }
        );
      }
      body.downloads = downloads;
    }

    const updatedAgent = await db.update(agents)
      .set(body)
      .where(eq(agents.id, agentId))
      .returning();

    const returnedAgent = updatedAgent[0];
    
    if (returnedAgent.features && typeof returnedAgent.features === 'string') {
      returnedAgent.features = JSON.parse(returnedAgent.features);
    }
    if (returnedAgent.requirements && typeof returnedAgent.requirements === 'string') {
      returnedAgent.requirements = JSON.parse(returnedAgent.requirements);
    }

    return NextResponse.json(
      {
        success: true,
        data: returnedAgent,
        message: 'Agent updated successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR'
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
    const authResult = await authenticateAdmin(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { 
          success: false,
          error: authResult.error,
          code: authResult.status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED'
        },
        { status: authResult.status }
      );
    }

    const params = await context.params;
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid agent ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const agentId = parseInt(id);

    const existingAgent = await db.select()
      .from(agents)
      .where(eq(agents.id, agentId))
      .limit(1);

    if (existingAgent.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Agent not found',
          code: 'AGENT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const deletedAgent = await db.delete(agents)
      .where(eq(agents.id, agentId))
      .returning();

    if (deletedAgent.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Agent not found',
          code: 'AGENT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const returnedAgent = deletedAgent[0];
    
    if (returnedAgent.features && typeof returnedAgent.features === 'string') {
      returnedAgent.features = JSON.parse(returnedAgent.features);
    }
    if (returnedAgent.requirements && typeof returnedAgent.requirements === 'string') {
      returnedAgent.requirements = JSON.parse(returnedAgent.requirements);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Agent deleted successfully',
        data: returnedAgent
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}