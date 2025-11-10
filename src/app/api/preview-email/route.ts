import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/components';
import { getTodaysColour } from '@/lib/colours';
import DailyColourEmail from '@/emails/DailyColourEmail';

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const colour = getTodaysColour();
    const permalink = `${process.env.PUBLIC_SITE_URL || 'http://localhost:3000'}/colour/${today}`;
    
    // Render the actual React Email template
    const html = await render(
      DailyColourEmail({
        colour,
        date: today,
        permalink,
      })
    );
    
    // Return the HTML directly so it renders in the browser
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating email preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate email preview' },
      { status: 500 }
    );
  }
}
