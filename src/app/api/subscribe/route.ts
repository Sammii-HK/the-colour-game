import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // This initializes posti-email

// Initialize posti-email client
const getPostiEmailClient = () => {
  const postiEmail = require('posti-email');
  return postiEmail;
};

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
    
    // Add subscriber to database
    try {
      // Check if already subscribed
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { email }
      });
      
      if (existingSubscriber && existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }
      
      // Add to subscriber list
      await prisma.subscriber.upsert({
        where: { email },
        update: { 
          isActive: true,
          unsubscribedAt: null,
        },
        create: { 
          email,
          isActive: true,
        },
      });
      
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
