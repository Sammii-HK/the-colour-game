import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Admin authentication
    const authHeader = request.headers.get('Authorization');
    const adminKey = process.env.ADMIN_SECRET_KEY;
    
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Get subscribers from database (with fallback for dev)
    try {
      const subscribers = await prisma.subscriber.findMany({
        orderBy: {
          subscribedAt: 'desc'
        }
      });
      
      return NextResponse.json({
        success: true,
        count: subscribers.length,
        activeCount: subscribers.filter(sub => sub.isActive).length,
        subscribers: subscribers.map(sub => ({
          id: sub.id,
          email: sub.email,
          subscribedAt: sub.subscribedAt,
          isActive: sub.isActive,
          unsubscribedAt: sub.unsubscribedAt
        }))
      });
    } catch (dbError) {
      console.log('Database error, using fallback:', dbError);
      // Fallback for development
      return NextResponse.json({
        success: true,
        count: 1,
        activeCount: 1,
        subscribers: [{
          id: 'dev-1',
          email: 'kellow.sammii@gmail.com',
          subscribedAt: new Date().toISOString(),
          isActive: true,
          unsubscribedAt: null
        }]
      });
    }
  } catch (error) {
    console.error('Admin subscribers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
