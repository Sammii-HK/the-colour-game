import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const score = searchParams.get('score') || '0';
    const streak = searchParams.get('streak') || '0';
    
    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: 60,
          fontWeight: 700,
          color: 'white',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '60px',
            borderRadius: '20px',
            textAlign: 'center',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.9 }}>
            🎮 CSS Color Challenge
          </div>
          <div style={{ fontSize: '96px', fontWeight: 'bold', marginBottom: '20px' }}>
            {score}
          </div>
          <div style={{ fontSize: '36px', marginBottom: '30px', opacity: 0.8 }}>
            High Score
          </div>
          <div style={{ fontSize: '32px', marginBottom: '20px', opacity: 0.7 }}>
            🔥 {streak} streak
          </div>
          <div style={{ fontSize: '28px', opacity: 0.6 }}>
            #dailycsscolor
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '24px',
            opacity: 0.7,
          }}
        >
          Daily CSS Colour
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating high score image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
