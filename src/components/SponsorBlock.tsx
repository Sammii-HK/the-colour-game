import { Info } from 'lucide-react';
interface SponsorBlockProps {
  sponsorName: string;
  sponsorUrl: string;
  className?: string;
}

export default function SponsorBlock({ sponsorName, sponsorUrl, className = '' }: SponsorBlockProps) {
  const handleClick = () => {
    // Track analytics event
    if (typeof window !== 'undefined' && 'plausible' in window) {
      const plausible = (window as unknown as { plausible?: (event: string, options: { props: Record<string, unknown> }) => void }).plausible;
      if (typeof plausible === 'function') {
        plausible('Sponsor Click', { 
          props: { sponsor: sponsorName } 
        });
      }
    }
  };
  
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Sponsored:</span>{' '}
            <a
              href={sponsorUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="font-semibold underline hover:text-yellow-900"
            >
              {sponsorName}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
