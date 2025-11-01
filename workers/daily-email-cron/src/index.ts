/**
 * Cloudflare Worker for Daily CSS Color email cron job
 * Triggers daily email sending at 7:30 AM London time
 */

export interface Env {
  // Environment variables
  DAILY_CSS_COLOR_API_URL: string; // Your main app URL
  CRON_SECRET_KEY: string; // Secret key to protect the endpoint
}

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Daily CSS Color cron job triggered');
    
    try {
      // Call your main app's email endpoint
      const response = await fetch(`${env.DAILY_CSS_COLOR_API_URL}/api/send-daily-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CRON_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'DailyCSS-Cron-Worker/1.0',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Daily email sent successfully:', result);
      } else {
        const error = await response.text();
        console.error('Failed to send daily email:', error);
        
        // Could add webhook notification here for failures
        throw new Error(`Email send failed: ${response.status} ${error}`);
      }
    } catch (error) {
      console.error('Cron job error:', error);
      
      // Re-throw to mark the cron job as failed in Cloudflare
      throw error;
    }
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Optional: Manual trigger endpoint for testing
    const url = new URL(request.url);
    
    if (url.pathname === '/trigger' && request.method === 'POST') {
      // Manual trigger for testing
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== `Bearer ${env.CRON_SECRET_KEY}`) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      try {
        // Trigger the same logic as the cron job
        await this.scheduled({} as ScheduledController, env, ctx);
        return new Response('Email triggered successfully', { status: 200 });
      } catch (error) {
        return new Response(`Error: ${error}`, { status: 500 });
      }
    }
    
    return new Response('Daily CSS Color Cron Worker - Use POST /trigger to manually trigger', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  },
};