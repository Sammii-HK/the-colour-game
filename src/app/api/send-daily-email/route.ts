import { NextRequest, NextResponse } from 'next/server';
import { getTodaysColour } from '@/lib/colours';
import { sendDailyColourEmail } from '@/lib/email';

// Simple in-memory cache for preventing duplicate sends
// In production, use Vercel KV or similar
const sentToday = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    // Verify request is from authorized source (Cloudflare Worker)
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET_KEY}`;
    
    if (!process.env.CRON_SECRET_KEY || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get today's date for idempotency
    const today = new Date().toISOString().split('T')[0];
    const idempotencyKey = `daily:${today}`;
    
    // Check if already sent today (basic protection)
    if (sentToday.has(idempotencyKey)) {
      return NextResponse.json(
        { message: 'Email already sent today', date: today },
        { status: 200 }
      );
    }
    
    // Get query parameters for sponsor info
    const { searchParams } = new URL(request.url);
    const sponsorName = searchParams.get('sponsor');
    const sponsorUrl = searchParams.get('url');
    
    // Get today's colour
    const colour = getTodaysColour();
    
    // Determine recipient
    const recipient = process.env.DAILY_TO_TEST || 'test@example.com';
    const permalink = `${process.env.PUBLIC_SITE_URL || 'http://localhost:3000'}/colour/${today}`;
    
    // Send the email
    const result = await sendDailyColourEmail({
      colour,
      date: today,
      permalink,
      to: recipient,
      sponsorName: sponsorName || undefined,
      sponsorUrl: sponsorUrl || undefined,
    });
    
    if (result.success) {
      // Mark as sent
      sentToday.add(idempotencyKey);
      
      // Clean up old entries (keep only today)
      sentToday.clear();
      sentToday.add(idempotencyKey);
      
      return NextResponse.json({
        success: true,
        message: 'Daily email sent successfully',
        date: today,
        colour: colour.name,
        recipient,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-daily-email:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing/preview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const preview = searchParams.get('preview') === 'true';
    
    if (!preview) {
      return NextResponse.json(
        { error: 'Use POST to send email, or add ?preview=true to preview' },
        { status: 405 }
      );
    }
    
    const today = new Date().toISOString().split('T')[0];
    const colour = getTodaysColour();
    const permalink = `${process.env.PUBLIC_SITE_URL || 'http://localhost:3000'}/colour/${today}`;
    
    return NextResponse.json({
      preview: true,
      date: today,
      colour,
      permalink,
      subject: `today's colour: ${colour.name} ${colour.hex}`,
      recipient: process.env.DAILY_TO_TEST || 'test@example.com',
    });
  } catch (error) {
    console.error('Error in preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}




