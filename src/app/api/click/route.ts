// app/api/click/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get('id');
    const url = searchParams.get('url');
    const colorName = searchParams.get('color');
    
    // Track click event
    if (emailId && url) {
      const fs = require('fs');
      const analyticsFile = '/tmp/email-analytics.json';
      
      try {
        let analytics: any = { totalClicks: 0, recentActivity: [] };
        
        if (fs.existsSync(analyticsFile)) {
          const data = fs.readFileSync(analyticsFile, 'utf8');
          analytics = JSON.parse(data);
        }
        
        analytics.totalClicks = (analytics.totalClicks || 0) + 1;
        analytics.recentActivity = analytics.recentActivity || [];
        analytics.recentActivity.unshift({
          type: 'click',
          emailId,
          url,
          colorName: colorName || 'unknown',
          timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 activities
        analytics.recentActivity = analytics.recentActivity.slice(0, 100);
        
        fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
      } catch (error) {
        console.error('Failed to log click event:', error);
      }
      
      // Redirect to original URL
      return NextResponse.redirect(decodeURIComponent(url));
    }
    
    // Fallback: redirect to homepage
    return NextResponse.redirect('https://www.thecolorgame.uk');
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.redirect('https://www.thecolorgame.uk');
  }
}
