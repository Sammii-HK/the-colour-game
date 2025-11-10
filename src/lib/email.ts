import { render } from '@react-email/components';
import DailyColourEmail from '@/emails/DailyColourEmail';
import { CssColour, formatRgb, formatHsl } from './colours';

const getWorkerEmailUrl = () => {
  // Use your deployed Cloudflare Worker URL
  return process.env.WORKER_EMAIL_URL || 'https://thecolorgame-email-sender.rss-reply.workers.dev';
};

export interface EmailOptions {
  colour: CssColour;
  date: string;
  permalink: string;
  to: string | string[];
  sponsorName?: string;
  sponsorUrl?: string;
}

/**
 * Send daily colour email using Cloudflare Workers + MailChannels
 */
export async function sendDailyColourEmail(options: EmailOptions) {
  const { colour, date, permalink, to, sponsorName, sponsorUrl } = options;
  
  const subject = `today's colour: ${colour.name} ${colour.hex}`;
  
  // Render React Email component
  const html = await render(
    DailyColourEmail({
      colour,
      date,
      permalink,
      sponsorName,
      sponsorUrl,
    })
  );
  
  // Fallback plain text version
  const text = createPlainTextEmail(options);
  
  try {
    const workerUrl = getWorkerEmailUrl();
    const recipients = Array.isArray(to) ? to : [to];
    
    const emailPayload = {
      to: recipients,
      from: process.env.DAILY_FROM_EMAIL || 'daily@thecolorgame.uk',
      fromName: process.env.DAILY_FROM_NAME || 'The Colour Game',
      subject,
      html,
      text,
    };
    
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify(emailPayload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as { error?: string };
      throw new Error(`Worker responded with ${response.status}: ${errorData.error || 'Unknown error'}`);
    }
    
    const result = await response.json() as { success?: boolean; data?: { id?: string } };
    
    console.log('Email sent successfully via Cloudflare Workers + MailChannels:', result.data?.id);
    return { success: true, data: { id: result.data?.id || 'sent' } };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * Create plain text version of the email
 */
function createPlainTextEmail(options: EmailOptions): string {
  const { colour, date, permalink, sponsorName, sponsorUrl, to } = options;
  
  let text = `Daily CSS Colour - ${date}\n\n`;
  text += `Today's colour: ${colour.name}\n`;
  text += `Hex: ${colour.hex}\n`;
  text += `RGB: ${formatRgb(colour.rgb)}\n`;
  text += `HSL: ${formatHsl(colour.hsl)}\n\n`;
  
  if (colour.notes) {
    text += `${colour.notes}\n\n`;
  }
  
  text += `What would you design with it? 🎨\n\n`;
  text += `View full details: ${permalink}\n\n`;
  
  if (sponsorName && sponsorUrl) {
    text += `---\n`;
    text += `Today's email is sponsored by ${sponsorName}: ${sponsorUrl}\n\n`;
  }
  
  text += `---\n`;
  text += `You're receiving this because you subscribed to Daily CSS Colour.\n`;
  text += `Unsubscribe: ${process.env.PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(Array.isArray(to) ? to[0] : to)}\n`;
  text += `Contact: hello@thecolorgame.uk\n\n`;
  text += `Daily CSS Color\n`;
  text += `Made with ❤️ for designers and developers`;
  
  return text;
}

/**
 * HTML template fallback (inline styles)
 */
export function createHtmlEmailFallback(options: EmailOptions): string {
  const { colour, date, permalink, sponsorName, sponsorUrl, to } = options;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily CSS Colour - ${colour.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: bold; color: #1f2937;">Daily CSS Color</h1>
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">${date}</p>
                        </td>
                    </tr>
                    
                    <!-- Colour Swatch -->
                    <tr>
                        <td style="padding: 0 40px 20px; text-align: center;">
                            <div style="width: 200px; height: 200px; background-color: ${colour.hex}; border-radius: 12px; margin: 0 auto; border: 2px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></div>
                        </td>
                    </tr>
                    
                    <!-- Colour Details -->
                    <tr>
                        <td style="padding: 20px 40px; text-align: center;">
                            <h2 style="margin: 0 0 16px; font-size: 28px; font-weight: bold; color: #1f2937;">${colour.name}</h2>
                            <p style="margin: 4px 0; font-size: 16px; color: #4b5563; font-family: Monaco, Consolas, 'Lucida Console', monospace;">Hex: ${colour.hex}</p>
                            <p style="margin: 4px 0; font-size: 16px; color: #4b5563; font-family: Monaco, Consolas, 'Lucida Console', monospace;">RGB: ${formatRgb(colour.rgb)}</p>
                            <p style="margin: 4px 0; font-size: 16px; color: #4b5563; font-family: Monaco, Consolas, 'Lucida Console', monospace;">HSL: ${formatHsl(colour.hsl)}</p>
                            ${colour.notes ? `<p style="margin: 16px 0 0; font-size: 16px; color: #6b7280; line-height: 1.5; font-style: italic;">${colour.notes}</p>` : ''}
                        </td>
                    </tr>
                    
                    <!-- Prompt -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
                                <p style="margin: 0; font-size: 18px; color: #374151; font-weight: 500;">What would you design with it? 🎨</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 32px 40px; text-align: center;">
                            <a href="${permalink}" style="background-color: #3b82f6; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 12px 24px;">View Full Details</a>
                        </td>
                    </tr>
                    
                    ${sponsorName && sponsorUrl ? `
                    <!-- Sponsor -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; text-align: center;">
                                <p style="margin: 0; font-size: 14px; color: #92400e;">Today's email is sponsored by <a href="${sponsorUrl}" style="color: #d97706; text-decoration: none; font-weight: 600;">${sponsorName}</a></p>
                            </div>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 8px 0; font-size: 14px; color: #6b7280;">You're receiving this because you subscribed to Daily CSS Color.</p>
                            <p style="margin: 8px 0; font-size: 14px; color: #6b7280;">
                                <a href="${process.env.PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(Array.isArray(to) ? to[0] : to)}" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a> | 
                                <a href="mailto:hello@thecolorgame.uk" style="color: #3b82f6; text-decoration: none;">Contact</a>
                            </p>
                            <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
                                Daily CSS Color<br>
                                Made with ❤️ for designers and developers
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `.trim();
}
