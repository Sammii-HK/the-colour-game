# Cloudflare Workers + Brevo Email Setup

## 🎉 What You Get
- **FREE email sending** (300 emails/day via Brevo free tier)
- **Verified domain sending** from daily@thecolorgame.uk
- **High deliverability** via Brevo infrastructure
- **Professional email service** with analytics and tracking

## Prerequisites
1. Cloudflare account (free)
2. Your domain (`thecolorgame.uk`) managed by Cloudflare
3. Wrangler CLI installed globally

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Authenticate with Cloudflare

```bash
wrangler auth login
```

This will open your browser to authenticate with Cloudflare.

## Step 3: Configure Your Domain

### Add DNS Records for Email Authentication

In your Cloudflare dashboard, add these DNS records:

**SPF Record (TXT)**
- Name: `thecolorgame.uk`
- Content: `v=spf1 a mx include:relay.mailchannels.net ~all`

**DMARC Record (TXT)**
- Name: `_dmarc.thecolorgame.uk`
- Content: `v=DMARC1; p=none; rua=mailto:daily@thecolorgame.uk`

**MailChannels Domain Verification (TXT)**
- Name: `_mailchannels.thecolorgame.uk`
- Content: `v=mc1 cfid=thecolorgame.uk`

## Step 4: Deploy the Worker

```bash
cd workers/email-sender
wrangler deploy
```

This will deploy your worker and give you a URL like:
`https://thecolorgame-email-sender.YOUR-SUBDOMAIN.workers.dev`

## Step 5: Configure Custom Route (Optional but Recommended)

In `wrangler.toml`, the route is already configured:
```toml
routes = [
  { pattern = "thecolorgame.uk/api/worker-email", zone_name = "thecolorgame.uk" }
]
```

Deploy again to activate the custom route:
```bash
wrangler deploy
```

## Step 6: Update Environment Variables

Your Next.js app is already configured to use:
- Default: `https://thecolorgame.uk/api/worker-email`
- Override with: `WORKER_EMAIL_URL` environment variable

## Step 7: Test Email Sending

```bash
# Test via your Next.js API
curl -X POST http://localhost:3000/api/send-daily-email \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Or test the worker directly
curl -X POST https://thecolorgame.uk/api/worker-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["your-email@example.com"],
    "from": "daily@thecolorgame.uk",
    "fromName": "The Colour Game",
    "subject": "Test Email",
    "html": "<h1>Hello World!</h1>",
    "text": "Hello World!"
  }'
```

## Troubleshooting

### 1. Email Not Sending
- Check DNS records are properly set
- Verify domain is managed by Cloudflare
- Check worker logs: `wrangler tail`

### 2. Worker Not Deploying
- Ensure you're authenticated: `wrangler auth whoami`
- Check zone name matches your domain in `wrangler.toml`

### 3. Custom Route Not Working
- Ensure domain is on Cloudflare (orange cloud)
- Check route pattern in `wrangler.toml`
- May take a few minutes to propagate

## Benefits Over Other Services

✅ **Free** - No monthly costs, no credit card required
✅ **Fast** - Edge-deployed, global performance
✅ **Reliable** - MailChannels handles deliverability
✅ **Simple** - No complex authentication or API keys
✅ **Scalable** - Handles up to 10k emails/day per domain

## Next Steps

1. **Deploy the worker** using the commands above
2. **Test email sending** with your daily color email
3. **Monitor performance** using Cloudflare dashboard
4. **Scale up** if needed (MailChannels offers paid tiers for higher volume)

## Support

- Cloudflare Workers: https://developers.cloudflare.com/workers/
- MailChannels: https://mailchannels.zendesk.com/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
