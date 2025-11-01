// app/api/click/route.ts
import { createClickRedirectHandler } from "posti-email/next";
import { NextRequest, NextResponse } from "next/server";

const handler = createClickRedirectHandler();

export async function GET(request: NextRequest) {
  try {
    const result = await handler(request);
    return result;
  } catch (error) {
    console.error('Click tracking error:', error);
    // Fallback: redirect to homepage
    return NextResponse.redirect('https://thecolorgame.uk');
  }
}
