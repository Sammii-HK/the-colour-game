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
      // Log unsubscribe (for now, until database is working)
      console.log('Unsubscribed:', email);
      
      // TODO: Remove from database when posti-email is working
      // await prisma.subscriber.update({
      //   where: { email },
      //   data: { isActive: false, unsubscribedAt: new Date() }
      // });
      
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
