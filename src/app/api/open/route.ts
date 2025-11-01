// app/api/open/route.ts
import { createOpenPixelHandler } from "posti-email/next";
import { NextRequest, NextResponse } from "next/server";

const handler = createOpenPixelHandler();

export async function GET(request: NextRequest) {
  try {
    const result = await handler(request);
    return result;
  } catch (error) {
    console.error('Open tracking error:', error);
    // Return transparent 1x1 pixel as fallback
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
