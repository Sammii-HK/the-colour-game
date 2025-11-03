export interface Env {
  // Add any environment variables you need here
}

interface EmailRequest {
  to: string[];
  from: string;
  fromName?: string;
  subject: string;
  html: string;
  text: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const emailData: EmailRequest = await request.json();
      
      // Validate required fields
      if (!emailData.to || !emailData.from || !emailData.subject || !emailData.html) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: to, from, subject, html' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Send email via MailChannels
      const mailChannelsResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: emailData.to.map(email => ({ email })),
              dkim_domain: emailData.from.split('@')[1], // Extract domain from email
              dkim_selector: 'mailchannels',
            }
          ],
          from: {
            email: emailData.from,
            name: emailData.fromName || 'The Colour Game'
          },
          subject: emailData.subject,
          content: [
            {
              type: 'text/html',
              value: emailData.html
            },
            {
              type: 'text/plain',
              value: emailData.text || stripHtml(emailData.html)
            }
          ]
        })
      });

      if (!mailChannelsResponse.ok) {
        const errorText = await mailChannelsResponse.text();
        console.error('MailChannels error:', errorText);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to send email',
          details: errorText
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const result = await mailChannelsResponse.json() as { id?: string };
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: { id: result.id || 'sent' }
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('Email sending error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  },
};

// Simple HTML to text converter
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
