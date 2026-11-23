import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { cleanScore, runLength } from '@/lib/game';

export const runtime = 'edge';

// The score page links here as /api/og/highscore?score=120&streak=12.
// Anything that is not a whole number up to six digits falls back to 0 so the image always renders.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const score = cleanScore(searchParams.get('score')) ?? 0;
    const streak = cleanScore(searchParams.get('streak')) ?? runLength(score);

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
          color: 'white',
          fontWeight: 700,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: '48px 80px',
            borderRadius: '24px',
            border: '2px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <div style={{ display: 'flex', fontSize: 44, opacity: 0.9, marginBottom: 12 }}>The Colour Game</div>
          <div style={{ display: 'flex', fontSize: 168, lineHeight: 1 }}>{String(score)}</div>
          <div style={{ display: 'flex', fontSize: 40, opacity: 0.85, marginTop: 16 }}>Practice best</div>
          <div style={{ display: 'flex', fontSize: 32, opacity: 0.75, marginTop: 12 }}>
            {`${streak} CSS colour${streak === 1 ? '' : 's'} named in a row`}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: 48, display: 'flex', fontSize: 26, opacity: 0.75 }}>#dailycsscolor</div>
        <div style={{ position: 'absolute', bottom: 40, right: 48, display: 'flex', fontSize: 26, opacity: 0.75 }}>thecolorgame.uk</div>
      </div>,
      { width: 1200, height: 630 }
    );
  } catch (error) {
    console.error('Error generating high score image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
