import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
    
    const fs = require('fs');
    const subscribersFile = '/tmp/subscribers.json';
    
    let subscribers = [];
    try {
      if (fs.existsSync(subscribersFile)) {
        const data = fs.readFileSync(subscribersFile, 'utf8');
        subscribers = JSON.parse(data);
      }
    } catch (error) {
      return NextResponse.json({ error: 'No subscriber data found' }, { status: 404 });
    }
    
    // Get cleanup parameters
    const { searchParams } = new URL(request.url);
    const daysInactive = parseInt(searchParams.get('days') || '90'); // Default 90 days
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);
    
    // Find inactive subscribers
    const inactiveSubscribers = subscribers.filter((sub: any) => {
      if (!sub.isActive) return false; // Already inactive
      
      const lastActivity = new Date(sub.subscribedAt);
      return lastActivity < cutoffDate;
    });
    
    // Mark as inactive (don't delete, just deactivate)
    let cleanedCount = 0;
    subscribers.forEach((sub: any) => {
      if (inactiveSubscribers.some((inactive: any) => inactive.email === sub.email)) {
        sub.isActive = false;
        sub.unsubscribedAt = new Date().toISOString();
        sub.reason = 'inactive_cleanup';
        cleanedCount++;
      }
    });
    
    // Save updated list
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    
    const activeCount = subscribers.filter((sub: any) => sub.isActive).length;
    
    return NextResponse.json({
      success: true,
      message: 'List cleanup completed',
      cleanedCount,
      activeSubscribers: activeCount,
      cutoffDate: cutoffDate.toISOString(),
      daysInactive
    });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
