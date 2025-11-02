import { NextRequest, NextResponse } from 'next/server';

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
    
    // Simple file-based subscriber storage for now
    const fs = require('fs');
    const path = require('path');
    const subscribersFile = '/tmp/subscribers.json';
    
    let subscribers = [];
    try {
      if (fs.existsSync(subscribersFile)) {
        const data = fs.readFileSync(subscribersFile, 'utf8');
        subscribers = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading subscribers file:', error);
    }
    
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers: subscribers.map((sub: any) => ({
        email: sub.email,
        subscribedAt: sub.subscribedAt,
        isActive: sub.isActive
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
