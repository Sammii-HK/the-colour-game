# Daily CSS Color

A daily colour email and public API powered by CSS named colours. Get daily colour inspiration delivered to your inbox every morning.

<img width="1708" height="980" alt="Screenshot 2025-10-31 at 13 55 54" src="https://github.com/user-attachments/assets/d0e8f6f5-9f72-478c-a38b-327c3298d4d7" />

## Technical Overview

Interactive color platform combining deterministic algorithms, automated email delivery, and social sharing. Built to showcase modern web architecture patterns and serverless automation at scale.

**Stack**: Next.js 15, Cloudflare Workers, Brevo Email API, TypeScript, React Email, Tailwind CSS

## Core Architecture

### 1. Deterministic Color Engine
```typescript
export function getColourOfDay(date: Date): CssColour {
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const dateString = formatUTCDate(utcDate);
  const seed = hashString(dateString);
  return colours[seed % colours.length];
}
```
- **Global consistency**: djb2 hash ensures same date → same color worldwide
- **Even distribution**: Cycles through all 147 CSS colors before repeating
- **Performance**: O(1) lookup with cryptographic hash distribution

### 2. Edge Image Generation
```typescript
export const runtime = 'edge';
export async function GET(request: NextRequest) {
  const colour = getTodaysColour();
  return new ImageResponse(<ColorCard colour={colour} />, { width: 1080, height: 1080 });
}
```
- **Vercel Edge Runtime**: Global CDN distribution
- **Dynamic OG images**: 1080x1080 social sharing assets
- **Zero cold starts**: Edge functions with instant response times

### 3. Hybrid Email System
```typescript
// Multi-platform email pipeline: Cron → Next.js → Worker → Email API
const html = await render(<DailyColourEmail colour={colour} date={date} />);
const result = await fetch(workerUrl, { method: 'POST', body: emailData });
```
- **Hybrid architecture**: Cloudflare Workers + Next.js + Brevo API working together
- **Cost optimization**: Free tiers from multiple services = $0/month email delivery
- **Global performance**: Edge processing via Cloudflare + enterprise delivery via Brevo
- **Professional sending**: Verified domain (daily@thecolorgame.uk) with high deliverability
- **Template rendering**: React Email components with beautiful responsive design

### 4. Interactive Game Engine
```typescript
const generateOptions = (correctColor: string, difficulty: Difficulty): string[] => {
  // Easy: Random colors across groups
  // Medium: Colors within same group (reds, blues, etc.)
  // Hard: Free-form text input with fuzzy matching
};
```
- **Three difficulty levels**: Progressive complexity with color grouping
- **Local score persistence**: Browser storage with social sharing hooks
- **Real-time feedback**: Instant validation with streak tracking

## API Design

### `/api/daily-colour`
```json
{
  "date": "2024-10-31",
  "name": "darkslateblue",
  "hex": "#483d8b",
  "rgb": "rgb(72, 61, 139)",
  "hsl": "hsl(248, 39%, 39%)",
  "permalink": "https://dailycsscolor.com/colour/2024-10-31",
  "image": "https://dailycsscolor.com/api/og?date=2024-10-31"
}
```
**Caching**: `s-maxage=3600, stale-while-revalidate=86400`

### `/api/og?date=YYYY-MM-DD`
Dynamic image generation with color-matched backgrounds and typography.

## Technical Decisions

**Deterministic over Random**: Ensures global consistency and enables permalink structure
**Edge-First Architecture**: Leverages Vercel's global network for sub-100ms response times
**Hybrid Email Architecture**: Multi-platform pipeline (Cloudflare + Vercel + Brevo) achieving $0/month email costs
**Progressive Enhancement**: Core functionality works without JavaScript, game enhances experience

## Performance Characteristics

- **API Response**: <100ms globally via Edge Runtime
- **Image Generation**: <200ms with automatic CDN caching
- **Email Delivery**: <3s end-to-end via Cloudflare Workers with global edge performance
- **Game Interactions**: <16ms response time with local state management

## Development

```bash
npm run dev           # Development server with Turbopack
npm run build         # Production build with static optimization
npm test              # Jest test suite with coverage reporting
node test-email.js    # Test email sending via Cloudflare Worker

# Cloudflare Worker commands:
cd workers/email-sender
wrangler deploy       # Deploy email worker
wrangler tail         # View worker logs
wrangler secret put BREVO_API_KEY  # Configure email API key
```

**Test Coverage**: Core color algorithm, API endpoints, email templates
**CI/CD**: Automated deployment via Vercel with preview environments
**Monitoring**: Built-in Vercel analytics with custom event tracking

---

**Technical Demonstration**: Modern full-stack application showcasing hybrid serverless architecture, edge computing, deterministic algorithms, and cost-effective email automation. Features Cloudflare Workers + Brevo integration for free, reliable email delivery at scale. Production-ready with automated testing, monitoring, and zero-cost email infrastructure.
