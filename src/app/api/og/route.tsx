/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getColourForDate, getTodaysColour } from '@/lib/colours';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // Get the colour for the specified date or today
    const colour = date ? getColourForDate(date) : getTodaysColour();
    
    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colour.hex,
          fontSize: 60,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '40px 60px',
            borderRadius: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div style={{ fontSize: '72px', fontWeight: 'bold' }}>
            {colour.name}
          </div>
          <div style={{ fontSize: '48px', opacity: 0.9 }}>
            {colour.hex}
          </div>
          <div style={{ fontSize: '32px', opacity: 0.7 }}>
            Daily CSS Colour
          </div>
        </div>
      </div>,
      {
        width: 1080,
        height: 1080,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
