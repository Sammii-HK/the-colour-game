import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only when needed
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
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
    
    // Check if we should use ConvertKit
    const useConvertKit = process.env.USE_CONVERTKIT === 'true';
    
    if (useConvertKit) {
      // ConvertKit integration
      const convertKitApiKey = process.env.CONVERTKIT_API_KEY;
      const convertKitFormId = process.env.CONVERTKIT_FORM_ID;
      
      if (!convertKitApiKey || !convertKitFormId) {
        return NextResponse.json(
          { error: 'ConvertKit configuration missing' },
          { status: 500 }
        );
      }
      
      const response = await fetch(`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: convertKitApiKey,
          email,
        }),
      });
      
      if (response.ok) {
        return NextResponse.json({ success: true });
      } else {
        const error = await response.json();
        return NextResponse.json(
          { error: error.message || 'Failed to subscribe' },
          { status: 400 }
        );
      }
    } else {
      // Use Resend Contacts API
      try {
        const resend = getResendClient();
        const result = await resend.contacts.create({
          email,
          audienceId: process.env.RESEND_AUDIENCE_ID || '',
        });
        
        return NextResponse.json({ success: true, id: result.data?.id });
      } catch (error: unknown) {
        // Handle duplicate email
        if (error instanceof Error && error.message?.includes('already exists')) {
          return NextResponse.json(
            { error: 'This email is already subscribed' },
            { status: 400 }
          );
        }
        
        console.error('Resend subscription error:', error);
        return NextResponse.json(
          { error: 'Failed to subscribe. Please try again.' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
