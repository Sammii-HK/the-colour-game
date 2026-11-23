import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cleanScore, runLength, scoreImagePath, scorePath } from '@/lib/game';

interface PageProps {
  params: Promise<{ score: string }>;
}

// Shared scores land here. The page exists so link previews can show the score image.
async function siteOrigin() {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'thecolorgame.uk';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}

const describe = (score: number) => {
  const run = runLength(score);
  return `A practice best of ${score}: ${run} CSS colour${run === 1 ? '' : 's'} named in a row. Can you beat it?`;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const score = cleanScore((await params).score);
  if (score === null) return { title: 'Score not found - The Colour Game' };
  const origin = await siteOrigin();
  const image = `${origin}${scoreImagePath(score)}`;
  const title = `Practice best: ${score} - The Colour Game`;
  return {
    title,
    description: describe(score),
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description: describe(score),
      url: `${origin}${scorePath(score)}`,
      siteName: 'The Colour Game',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: `Practice best of ${score} in The Colour Game` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: describe(score),
      images: [image],
    },
  };
}

export default async function ScorePage({ params }: PageProps) {
  const score = cleanScore((await params).score);
  if (score === null) notFound();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-violet-700 dark:text-violet-200 mb-3">The Colour Game</p>
        <h1 className="text-5xl font-bold tabular-nums text-gray-900 dark:text-white mb-2">{score}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{describe(score)}</p>
        <Link
          href="/#game-title"
          className="inline-flex min-h-11 items-center rounded-xl bg-violet-700 px-6 py-3 text-base font-medium text-white hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          Play the game
        </Link>
      </div>
    </main>
  );
}
