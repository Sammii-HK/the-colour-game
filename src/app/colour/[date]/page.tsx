import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daily CSS Colour
          </h1>
          <p className="text-lg text-gray-600">
            {formatDate(date)}
          </p>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Swatch */}
          <div className="h-64 sm:h-80 relative" style={{ backgroundColor: colour.hex }}>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {colour.name}
                </h2>
                <p className="text-xl sm:text-2xl text-white font-mono drop-shadow-lg">
                  {colour.hex}
                </p>
              </div>
            </div>
          </div>
          
          {/* Colour Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Values */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Colour Values
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-500">HEX</span>
                      <p className="font-mono text-lg">{colour.hex}</p>
                    </div>
                    <CopyButton text={colour.hex} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-500">RGB</span>
                      <p className="font-mono text-lg">{formatRgb(colour.rgb)}</p>
                    </div>
                    <CopyButton text={formatRgb(colour.rgb)} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-500">HSL</span>
                      <p className="font-mono text-lg">{formatHsl(colour.hsl)}</p>
                    </div>
                    <CopyButton text={formatHsl(colour.hsl)} />
                  </div>
                </div>
                
                {/* CSS Variables */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    CSS Variables
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm">--color-primary: {colour.hex};</code>
                      <CopyButton text={`--color-primary: ${colour.hex};`} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm">--color-primary-rgb: {colour.rgb.join(', ')};</code>
                      <CopyButton text={`--color-primary-rgb: ${colour.rgb.join(', ')};`} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Info */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  About This Colour
                </h3>
                
                {colour.notes && (
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {colour.notes}
                  </p>
                )}
                
                {colour.keywords && colour.keywords.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {colour.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Social Image */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Social Image
                  </h4>
                  <Image
                    src={imageUrl}
                    alt={`${colour.name} colour swatch`}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-lg border-2 border-gray-200 mb-3"
                  />
                  <a
                    href={imageUrl}
                    download={`daily-css-colour-${date}.png`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
