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
      // Check if already subscribed using Prisma
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { email }
      });
      
      if (existingSubscriber && existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }
      
      if (existingSubscriber) {
        // Reactivate existing subscriber
        await prisma.subscriber.update({
          where: { email },
          data: {
            isActive: true,
            subscribedAt: new Date(),
            unsubscribedAt: null
          }
        });
        console.log('Reactivated subscriber:', email);
      } else {
        // Add new subscriber
        await prisma.subscriber.create({
          data: {
            email,
            isActive: true
          }
        });
      console.log('New subscriber added:', email);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully subscribed to daily color emails'
      });
    } catch (error: unknown) {
      console.error('Subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
