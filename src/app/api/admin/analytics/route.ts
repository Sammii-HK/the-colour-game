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
    
    // Simple analytics from log files
    const fs = require('fs');
    const analyticsFile = '/tmp/email-analytics.json';
    
    let analytics = {
      totalSent: 0,
      totalOpens: 0,
      totalClicks: 0,
      openRate: 0,
      clickRate: 0,
      popularColors: [],
      recentActivity: []
    };
    
    try {
      if (fs.existsSync(analyticsFile)) {
        const data = fs.readFileSync(analyticsFile, 'utf8');
        analytics = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading analytics:', error);
    }
    
    // Calculate rates
    if (analytics.totalSent > 0) {
      analytics.openRate = Math.round((analytics.totalOpens / analytics.totalSent) * 100);
      analytics.clickRate = Math.round((analytics.totalClicks / analytics.totalSent) * 100);
    }
    
    return NextResponse.json({
      success: true,
      analytics
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
