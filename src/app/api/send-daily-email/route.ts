import { NextRequest, NextResponse } from 'next/server';
import { getTodaysColour } from '@/lib/colours';
import { sendDailyColourEmail } from '@/lib/email';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sentToday = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    // Verify request is from authorized source (Cloudflare Worker)
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET_KEY || process.env.CRON_SECRET}`;
    
    if (!(process.env.CRON_SECRET_KEY || process.env.CRON_SECRET) || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get today's date for idempotency
    const today = new Date().toISOString().split('T')[0];
    const idempotencyKey = `daily:${today}`;
    
    // Get query parameters for sponsor info and force resend
    const { searchParams } = new URL(request.url);
    const forceResend = searchParams.get('force') === 'true';
    const sponsorName = searchParams.get('sponsor');
    const sponsorUrl = searchParams.get('url');
    
    // Check if already sent today (basic protection)
    if (sentToday.has(idempotencyKey) && !forceResend) {
      return NextResponse.json(
        { message: 'Email already sent today', date: today },
        { status: 200 }
      );
    }
    
    // Get today's colour
    const colour = getTodaysColour();
    
    // Get active subscribers from database
    let recipients: string[] = [];
    
    try {
      const activeSubscribers = await prisma.subscriber.findMany({
        where: { isActive: true },
        select: { email: true }
      });
      
      if (activeSubscribers.length > 0) {
        recipients = activeSubscribers.map(sub => sub.email);
        console.log(`Found ${recipients.length} active subscribers`);
      } else {
        // Fallback to test emails from environment variable
        const defaultEmails = (process.env.DAILY_TO_TEST || 'kellow.sammii@gmail.com')
          .split(',')
          .map(email => email.trim())
          .filter(email => email);
        
        recipients = defaultEmails;
        console.log(`No subscribers found, using test emails: ${recipients.length}`);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      // Fallback to test email
      recipients = [process.env.DAILY_TO_TEST || 'kellow.sammii@gmail.com'];
      console.log('Database error, using fallback email');
    }
    const permalink = `${process.env.PUBLIC_SITE_URL || 'http://localhost:3000'}/colour/${today}`;
    
    // Send the email
    const result = await sendDailyColourEmail({
      colour,
      date: today,
      permalink,
      to: recipients,
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
        recipients: recipients.length,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: 'Email sending failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-daily-email:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
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




