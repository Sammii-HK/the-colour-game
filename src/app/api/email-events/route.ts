// app/api/email-events/route.ts
import { createSesWebhookHandler } from "posti-email/next";
import { NextRequest, NextResponse } from "next/server";

const handler = createSesWebhookHandler();

export async function POST(request: NextRequest) {
  try {
    const result = await handler(request);
    return result;
  } catch (error) {
    console.error('Email webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
