import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getColourForDate, formatRgb, formatHsl } from '@/lib/colours';
import CopyButton from '@/components/CopyButton';

interface PageProps {
  params: Promise<{
    date: string;
  }>;
}

// Validate date format
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString + 'T00:00:00.000Z');
  return !isNaN(date.getTime());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  if (!isValidDate(date)) {
    return {
      title: 'Invalid Date - Daily CSS Colour',
    };
  }
  
  const colour = getColourForDate(date);
  const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = `${siteUrl}/api/og?date=${date}`;
  
  return {
    title: `${colour.name} (${colour.hex}) - Daily CSS Colour`,
    description: `${colour.name} - ${colour.hex}. ${colour.notes || `Discover this beautiful CSS colour and copy its values for your next project.`}`,
    openGraph: {
      title: `${colour.name} - Daily CSS Colour`,
      description: `${colour.hex} - ${colour.notes || 'A beautiful CSS colour for your designs'}`,
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 1080,
          alt: `${colour.name} colour swatch`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${colour.name} - Daily CSS Colour`,
      description: `${colour.hex} - ${colour.notes || 'A beautiful CSS colour for your designs'}`,
      images: [imageUrl],
    },
  };
}

export default async function ColourPage({ params }: PageProps) {
  const { date } = await params;
  if (!isValidDate(date)) {
    notFound();
  }
  
  const colour = getColourForDate(date);
  const siteUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = `${siteUrl}/api/og?date=${date}`;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Calculate if color is light or dark for better contrast
  const isLightColor = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff; 
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128;
  };

  const isLight = isLightColor(colour.hex);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Daily CSS Colour
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {formatDate(date)}
          </p>
        </div>
        
        {/* Main Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
          {/* Hero Swatch */}
          <div className="h-64 sm:h-80 relative" style={{ backgroundColor: colour.hex }}>
            <div className={`absolute inset-0 flex items-center justify-center ${
              isLight 
                ? 'bg-gradient-to-b from-black/60 via-black/40 to-black/60' 
                : 'bg-gradient-to-b from-black/30 via-black/20 to-black/30'
            }`}>
              <div className="text-center">
                <h2 className={`text-4xl sm:text-5xl font-bold mb-2 ${
                  isLight 
                    ? 'text-white drop-shadow-xl' 
                    : 'text-white drop-shadow-lg'
                }`}>
                  {colour.name}
                </h2>
                <p className={`text-xl sm:text-2xl font-mono ${
                  isLight 
                    ? 'text-gray-100 drop-shadow-xl' 
                    : 'text-white drop-shadow-lg'
                }`}>
                  {colour.hex}
                </p>
              </div>
            </div>
          </div>
          
          {/* Colour Details */}
          <div className="p-6 sm:p-8 bg-white dark:bg-neutral-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Values */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Colour Values
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">CSS COLOR</span>
                      <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{colour.name.toLowerCase()}</p>
                    </div>
                    <CopyButton text={colour.name.toLowerCase()} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">HEX</span>
                      <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{colour.hex}</p>
                    </div>
                    <CopyButton text={colour.hex} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">RGB</span>
                      <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{formatRgb(colour.rgb)}</p>
                    </div>
                    <CopyButton text={formatRgb(colour.rgb)} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">HSL</span>
                      <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{formatHsl(colour.hsl)}</p>
                    </div>
                    <CopyButton text={formatHsl(colour.hsl)} />
                  </div>
                </div>
                
                {/* CSS Variables */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    CSS Variables
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                      <code className="text-sm text-gray-800 dark:text-gray-200">--color-primary: {colour.hex};</code>
                      <CopyButton text={`--color-primary: ${colour.hex};`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 dark:border-neutral-600">
                      <code className="text-sm text-gray-800 dark:text-gray-200">--color-primary-rgb: {colour.rgb.join(', ')};</code>
                      <CopyButton text={`--color-primary-rgb: ${colour.rgb.join(', ')};`} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Info */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About This Colour
                </h3>
                
                {colour.notes && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {colour.notes}
                  </p>
                )}
                
                {colour.keywords && colour.keywords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {colour.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-200 dark:border-neutral-600"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social Image */}
                <div className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4 bg-gray-50 dark:bg-neutral-700">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                    Social Image
                  </h4>
                  <div className="w-32 h-32 rounded-lg border-2 border-gray-200 dark:border-neutral-600 mb-3 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`${colour.name} colour swatch`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a simple color swatch if OG image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div 
                      className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ 
                        backgroundColor: colour.hex,
                        display: 'none'
                      }}
                    >
                      {colour.name}
                    </div>
                  </div>
                  <a
                    href={imageUrl}
                    download={`daily-css-colour-${date}.png`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600"
                  >
                    Download Image
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all duration-200 hover:opacity-90`}
            style={{ 
              backgroundColor: colour.hex,
              color: isLight ? '#1f2937' : '#ffffff', // Dark text for light colors, white text for dark colors
              boxShadow: `0 4px 15px ${colour.hex}40`
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
