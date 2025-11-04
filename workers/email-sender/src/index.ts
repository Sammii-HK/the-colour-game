export interface Env {
  BREVO_API_KEY?: string;
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

      // Send email via Brevo
      if (!env.BREVO_API_KEY) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'BREVO_API_KEY not configured',
          details: 'Please set BREVO_API_KEY environment variable'
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            email: emailData.from,
            name: emailData.fromName || 'The Colour Game'
          },
          to: emailData.to.map(email => ({ email })),
          subject: emailData.subject,
          htmlContent: emailData.html,
          textContent: emailData.text || stripHtml(emailData.html)
        })
      });

      if (!brevoResponse.ok) {
        const errorText = await brevoResponse.text();
        console.error('Brevo error:', errorText);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to send email via Brevo',
          details: errorText
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      const result = await brevoResponse.json() as { messageId?: string };
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: { id: result.messageId || 'sent' }
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
