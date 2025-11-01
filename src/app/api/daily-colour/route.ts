import { NextResponse } from 'next/server';
import { getTodaysColour, formatRgb, formatHsl } from '@/lib/colours';

export async function GET() {
  try {
    const colour = getTodaysColour();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const response = {
      date: today,
      name: colour.name,
      hex: colour.hex,
      rgb: formatRgb(colour.rgb),
      hsl: formatHsl(colour.hsl),
      description: colour.notes || `${colour.name} - ${colour.hex}`,
      permalink: `${process.env.PUBLIC_SITE_URL || 'https://thecolorgame.uk'}/colour/${today}`,
      image: `${process.env.PUBLIC_SITE_URL || 'https://thecolorgame.uk'}/api/og?date=${today}`,
      challenge: {
        title: `Today's Creative Challenge: ${colour.name}`,
        prompt: `Create something beautiful using ${colour.name}! Draw, paint, design, code, craft, or photograph - then share it with #DailyColourChallenge`,
        ideas: ["Abstract art", "Logo design", "CSS animation", "Watercolor painting", "Digital illustration", "Photography", "Crafts", "Web design"],
        hashtag: "#dailycsscolor"
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in /api/daily-colour:', error);
    return NextResponse.json(
      { error: 'Failed to get daily colour' },
      { status: 500 }
    );
  }
}
