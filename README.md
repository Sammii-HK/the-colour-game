# Daily CSS Colour

A daily colour email and public API powered by CSS named colours. Get a beautiful colour delivered to your inbox every morning at 7:30 AM London time.

## 🎨 Features

- **Daily Colour Email**: Beautiful HTML emails with colour swatches, values, and descriptions
- **Public API**: RESTful API for accessing daily colours and colour data
- **Deterministic Colours**: Each date maps to a specific colour, cycling through all CSS named colours
- **Social Images**: Auto-generated 1080x1080 PNG images for social media
- **Permalink Pages**: Dedicated pages for each day's colour with copy buttons and structured data
- **Email Signup**: Resend or ConvertKit integration for subscriber management
- **Colour Game**: Interactive game to test CSS colour knowledge
- **Sponsor Support**: Built-in sponsorship blocks for monetization
- **Analytics**: Plausible integration for privacy-friendly tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Resend API key (for emails)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables (see below)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

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

## 📡 API Endpoints

### GET /api/daily-colour

Returns today's colour with all values and metadata.

**Response:**
```json
{
  "date": "2025-10-11",
  "name": "CornflowerBlue",
  "hex": "#6495ED",
  "rgb": "rgb(100, 149, 237)",
  "hsl": "hsl(219, 79%, 66%)",
  "description": "Soft mid-blue reminiscent of early web palettes",
  "permalink": "https://site.tld/colour/2025-10-11",
  "image": "https://site.tld/api/og?date=2025-10-11"
}
```

### GET /api/og

Generates social media images (1080x1080 PNG).

**Query Parameters:**
- `date` (optional): YYYY-MM-DD format, defaults to today

### POST /api/send-daily-email

Sends the daily colour email (used by cron job).

**Query Parameters:**
- `sponsor` (optional): Sponsor name
- `url` (optional): Sponsor URL

### POST /api/subscribe

Subscribe to the daily email list.

**Body:**
```json
{
  "email": "user@example.com"
}
```

## 🕐 Cron Scheduling

The app includes Vercel Cron configuration to send daily emails at 7:30 AM London time.

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/send-daily-email",
      "schedule": "30 7 * * *"
    }
  ]
}
```

## 🎯 Colour Algorithm

The `getColourOfDay()` function uses a deterministic algorithm to map each UTC date to a specific colour:

1. Converts date to UTC to ensure consistency across timezones
2. Creates a hash from the date string (YYYY-MM-DD)
3. Uses modulo to map the hash to a colour index
4. Returns the corresponding colour from the dataset

This ensures:
- Same date always returns the same colour
- All colours are used before repeating
- Global consistency regardless of timezone

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The test suite includes:
- Unit tests for the colour algorithm
- Contract tests for API endpoints
- Deterministic behaviour verification

## 📱 Social Media Integration

Generate today's social image locally:

```bash
npm run generate:today
```

This creates:
- `generated/daily-css-colour-YYYY-MM-DD.png` - Social media image
- `generated/daily-css-colour-YYYY-MM-DD.json` - Colour data

Perfect for manual social media posting with your scheduler.

## 💰 Monetization

The app includes sponsor block components that can be used in:
- Email templates
- Web pages
- API responses

Add sponsor parameters to the daily email:
```
POST /api/send-daily-email?sponsor=YourSponsor&url=https://sponsor.com
```

## 🎮 Colour Game

Interactive game features:
- Three difficulty levels (easy, medium, hard)
- Score tracking with streaks
- Analytics event tracking
- Responsive design

## 📊 Analytics

Integrated with Plausible for privacy-friendly analytics:
- Page views on permalink pages
- Email signup tracking
- Copy button clicks
- Game interaction events

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- AWS
- Google Cloud
- Self-hosted

## 📝 Data Structure

Each colour in the dataset includes:

```typescript
type CssColour = {
  name: string;        // e.g. "CornflowerBlue"
  hex: string;         // e.g. "#6495ED"
  rgb: [number, number, number];
  hsl: [number, number, number];
  keywords: string[];  // optional tags
  notes?: string;      // short human description
};
```

The dataset includes 147 CSS named colours with curated descriptions and keywords.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🎨 Credits

- CSS colour data curated from W3C specifications
- Built with Next.js, React Email, and Resend
- Social images generated with @vercel/og
- Styled with Tailwind CSS

---

Made with ❤️ for designers and developers who love beautiful colours.