'use client';

import { Check, Copy } from 'lucide-react';


import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Track analytics event if available
      if (typeof window !== 'undefined' && 'plausible' in window) {
        const plausible = (window as unknown as { plausible?: (event: string, options: { props: Record<string, unknown> }) => void }).plausible;
        if (typeof plausible === 'function') {
          plausible('Copy Value', { 
            props: { value: text.substring(0, 20) } 
          });
        }
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 focus:ring-blue-500 transition-colors ${className}`}
      title={`Copy ${text}`}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 mr-1 text-green-500" aria-hidden="true" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 mr-1" aria-hidden="true" />
          Copy
        </>
      )}
    </button>
  );
}
