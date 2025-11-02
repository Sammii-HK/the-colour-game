// app/api/open/route.ts
import { createOpenPixelHandler } from "posti-email/next";
import { NextRequest, NextResponse } from "next/server";

const handler = createOpenPixelHandler();

export async function GET(request: NextRequest) {
  try {
    // Track email open
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get('id');
    const colorName = searchParams.get('color');
    
    // Log the open event
    if (emailId) {
      const fs = require('fs');
      const analyticsFile = '/tmp/email-analytics.json';
      
      try {
        let analytics: any = { totalOpens: 0, recentActivity: [] };
        
        if (fs.existsSync(analyticsFile)) {
          const data = fs.readFileSync(analyticsFile, 'utf8');
          analytics = JSON.parse(data);
        }
        
        analytics.totalOpens = (analytics.totalOpens || 0) + 1;
        analytics.recentActivity = analytics.recentActivity || [];
        analytics.recentActivity.unshift({
          type: 'open',
          emailId,
          colorName: colorName || 'unknown',
          timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 activities
        analytics.recentActivity = analytics.recentActivity.slice(0, 100);
        
        fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
      } catch (error) {
        console.error('Failed to log open event:', error);
      }
    }
    
    // Return 1x1 transparent pixel
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Open tracking error:', error);
    // Return pixel anyway
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
