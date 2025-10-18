import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { session, user } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 });
    }

    // Validate Bearer token format
    const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid token format. Expected: Bearer <token>'
      }, { status: 401 });
    }

    const token = tokenMatch[1];

    // Query session with user data
    const currentTime = new Date();
    const sessionData = await db
      .select({
        sessionId: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        userName: user.name,
        userEmail: user.email,
        isAdmin: user.isAdmin,
      })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(
        and(
          eq(session.token, token),
          gt(session.expiresAt, currentTime)
        )
      )
      .limit(1);

    // Check if session exists and is valid
    if (sessionData.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired session'
      }, { status: 401 });
    }

    const userData = sessionData[0];

    // Check if user is admin
    if (!userData.isAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Forbidden',
        message: 'Admin access required'
      }, { status: 403 });
    }

    // Return success response with user info
    return NextResponse.json({
      success: true,
      isAdmin: true,
      user: {
        id: userData.userId,
        name: userData.userName,
        email: userData.userEmail
      }
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while checking admin status'
    }, { status: 500 });
  }
}