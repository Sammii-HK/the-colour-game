# Daily CSS Color

A daily color platform built with Next.js that combines an interactive color recognition game with automated email delivery and social sharing. Demonstrates modern web architecture, serverless automation, and viral growth mechanics.

## What It Does

- **Interactive color game** with difficulty levels and score tracking
- **Daily color emails** sent automatically via cron job
- **Social image generation** for sharing colors and scores
- **Public API** for color data with proper caching
- **Deterministic color selection** - same date always gives same color globally

## Architecture & Implementation

### Tech Stack
- **Next.js 15** with App Router and TypeScript
- **Vercel Edge Functions** for global API distribution
- **React Email + Resend** for automated email delivery
- **Tailwind CSS** for component styling
- **Jest** for comprehensive testing

### Key Technical Features

#### 1. Deterministic Color Engine
```typescript
export function getColourOfDay(date: Date): CssColour {
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const dateString = formatUTCDate(utcDate);
  const seed = hashString(dateString);
  return colours[seed % colours.length];
}
```
- **Global consistency**: Same date returns same color worldwide
- **Predictable cycling**: All 147 CSS colors used before repeating
- **Performance**: O(1) lookup with cryptographic hash distribution

#### 2. Social Image Generation
```typescript
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const colour = getTodaysColour();
  return new ImageResponse(
    <div style={{ backgroundColor: colour.hex }}>
      <div>{colour.name}</div>
      <div>{colour.hex}</div>
    </div>,
    { width: 1080, height: 1080 }
  );
}
```
Generates 1080x1080 images for daily color sharing on social media.

## 🔧 Environment Variables

### Required

```env
RESEND_API_KEY=your_resend_api_key_here
DAILY_FROM_EMAIL=hello@yourdomain.com
DAILY_TO_TEST=test@yourdomain.com
PUBLIC_SITE_URL=https://yourdomain.com
```

### Optional

```env
# Resend Audience ID for contact management
RESEND_AUDIENCE_ID=your_audience_id_here

# ConvertKit integration (alternative to Resend contacts)
USE_CONVERTKIT=false
CONVERTKIT_API_KEY=your_convertkit_api_key
CONVERTKIT_FORM_ID=your_convertkit_form_id

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

## Core Implementation

### Deterministic Color Algorithm
```typescript
export function getColourOfDay(date: Date): CssColour {
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const dateString = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1).toString().padStart(2, '0')}-${utcDate.getDate().toString().padStart(2, '0')}`;
  const seed = hashString(dateString);
  return colours[seed % colours.length];
}
```

Uses djb2 hash algorithm to map dates to colors. Same date always returns the same color worldwide.

### Email Automation
```typescript
const html = await render(<DailyColourEmail colour={colour} date={date} />);
await resend.emails.send({ from: 'daily@domain.com', html, subject });
```

React Email templates sent via Vercel Cron at 7:30 AM London time with duplicate send protection.

## Technical Decisions

### Game-First Architecture
Prioritized interactive gameplay over static content to drive engagement. The color recognition game uses React state management with three difficulty levels and persistent score tracking.

### Serverless Automation  
Daily emails automated via Vercel Cron jobs with idempotency protection. React Email templates rendered server-side and delivered via Resend API.

### Edge Image Generation
Dynamic social images generated using Vercel Edge Runtime and Satori. Creates 1080x1080 PNGs for daily color sharing.

## Development

```bash
npm install
npm run dev           # Development server
npm run build         # Production build
npm test              # Jest test suite
npm run generate:today # Social media assets
```

## What This Demonstrates

### Full-Stack TypeScript
End-to-end type safety from React components to API routes to email templates. Strict TypeScript configuration with comprehensive error handling.

### Serverless Architecture
Zero-infrastructure approach using Vercel Edge Functions and Cron Jobs. Automated daily operations without server management.

### Product Engineering
Game mechanics designed for viral sharing and user engagement. Social media integration with hashtag-driven community building.

### Performance Focus
Optimized bundle sizes, edge caching, and static generation where possible. Real-world performance considerations for production deployment.


---

## Technical Implementation

**Full-stack TypeScript application** demonstrating:

- **Deterministic algorithms** - Hash-based color selection ensuring global consistency
- **Serverless automation** - Cron jobs and email delivery without infrastructure management  
- **Edge computing** - Global API distribution via Vercel Edge Functions
- **Interactive UX** - Game mechanics designed for engagement and viral sharing
- **Production systems** - Error handling, monitoring, and automated deployment
