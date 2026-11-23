'use client';

import { useState } from 'react';

interface SocialImagePreviewProps {
  src: string;
  name: string;
  hex: string;
}

// Shows the generated social image, or a plain swatch if the image cannot load.
export default function SocialImagePreview({ src, name, hex }: SocialImagePreviewProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm text-center p-2" style={{ backgroundColor: hex }}>
        {name}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`${name} colour swatch`} className="w-full h-full object-cover" onError={() => setFailed(true)} />
  );
}
