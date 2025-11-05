import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email: string };
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    try {
      // Find and deactivate subscriber in database
      const subscriber = await prisma.subscriber.findUnique({
        where: { email }
      });
      
      if (subscriber) {
        await prisma.subscriber.update({
          where: { email },
          data: {
            isActive: false,
            unsubscribedAt: new Date()
          }
        });
        console.log('Unsubscribed:', email);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully unsubscribed from daily color emails'
      });
    } catch (error: unknown) {
      console.error('Unsubscribe error:', error);
      return NextResponse.json(
        { error: 'Failed to unsubscribe. Please contact hello@thecolorgame.uk' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
