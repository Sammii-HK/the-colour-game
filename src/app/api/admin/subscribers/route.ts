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
    
    // Get subscribers from database
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
  } catch (error) {
    console.error('Admin subscribers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
