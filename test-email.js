#!/usr/bin/env node

// Simple test script to verify email sending works
// Using built-in fetch (Node.js 18+)

async function testEmail() {
  const workerUrl = process.env.WORKER_EMAIL_URL || 'https://www.thecolorgame.uk/worker/email';
  const testEmail = process.env.TEST_EMAIL || 'your-email@example.com';
  
  console.log('🧪 Testing email sending...');
  console.log(`📧 Sending to: ${testEmail}`);
  console.log(`🌐 Worker URL: ${workerUrl}`);
  
  const emailPayload = {
    to: [testEmail],
    from: 'daily@thecolorgame.uk',
    fromName: 'The Colour Game',
    subject: 'Test Email from Cloudflare Workers + MailChannels',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">🎨 Test Email Success!</h1>
        <p>This email was sent via Cloudflare Workers + MailChannels.</p>
        <p>Your email setup is working correctly! 🎉</p>
        <hr>
        <p style="color: #666; font-size: 14px;">
          Sent from The Colour Game daily email service
        </p>
      </div>
    `,
    text: `
🎨 Test Email Success!

This email was sent via Cloudflare Workers + MailChannels.
Your email setup is working correctly! 🎉

---
Sent from The Colour Game daily email service
    `.trim()
  };
  
  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`📬 Message ID: ${result.data?.id || 'N/A'}`);
      console.log('🎉 Your Cloudflare Workers + MailChannels setup is working!');
    } else {
      console.error('❌ Email sending failed');
      console.error('Response:', result);
    }
  } catch (error) {
    console.error('❌ Error testing email:', error.message);
    console.log('\n💡 Tips:');
    console.log('1. Make sure your Cloudflare Worker is deployed');
    console.log('2. Check that DNS records are configured');
    console.log('3. Verify the worker URL is correct');
  }
}

// Check if email is provided
if (!process.env.TEST_EMAIL && process.argv.length < 3) {
  console.log('Usage: node test-email.js your-email@example.com');
  console.log('Or set TEST_EMAIL environment variable');
  process.exit(1);
}

if (process.argv[2]) {
  process.env.TEST_EMAIL = process.argv[2];
}

testEmail();
