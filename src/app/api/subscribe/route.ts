import { NextRequest, NextResponse } from 'next/server';

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
      // Simple file-based storage for now
      const fs = require('fs');
      const subscribersFile = '/tmp/subscribers.json';
      
      let subscribers = [];
      try {
        if (fs.existsSync(subscribersFile)) {
          const data = fs.readFileSync(subscribersFile, 'utf8');
          subscribers = JSON.parse(data);
        }
      } catch (error) {
        console.log('Creating new subscribers file');
      }
      
      // Check if already subscribed
      const existingSubscriber = subscribers.find((sub: any) => sub.email === email);
      if (existingSubscriber && existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }
      
      // Add new subscriber
      const newSubscriber = {
        email,
        subscribedAt: new Date().toISOString(),
        isActive: true
      };
      
      if (existingSubscriber) {
        // Reactivate existing subscriber
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date().toISOString();
      } else {
        subscribers.push(newSubscriber);
      }
      
      // Save to file
      fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
      console.log('New subscriber added:', email);
      
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
