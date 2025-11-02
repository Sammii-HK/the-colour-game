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
        console.log('No subscribers file found');
      }
      
      // Find and deactivate subscriber
      const subscriber = subscribers.find((sub: any) => sub.email === email);
      if (subscriber) {
        subscriber.isActive = false;
        subscriber.unsubscribedAt = new Date().toISOString();
        
        // Save updated list
        fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
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
