'use client';

import { useState } from 'react';

export default function EmailSignupForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    setStatus('loading');
    
    try {
      // Check if we should use ConvertKit or Resend
      const useConvertKit = process.env.NEXT_PUBLIC_USE_CONVERTKIT === 'true';
      
      if (useConvertKit) {
        // ConvertKit integration would go here
        // For now, show success message
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email to confirm.');
      } else {
        // Resend Contacts API or simple collection
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        if (response.ok) {
          setStatus('success');
          setMessage('Thanks for subscribing! You\'ll receive your first colour tomorrow morning.');
          setEmail('');
          
          // Track analytics event
          if (typeof window !== 'undefined' && 'plausible' in window) {
            const plausible = (window as any).plausible;
            if (typeof plausible === 'function') {
              plausible('Email Signup', { props: { source: 'homepage' } });
            }
          }
        } else {
          const data = await response.json() as { error?: string };
          setStatus('error');
          setMessage(data.error || 'Something went wrong. Please try again.');
        }
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-3 text-sm text-center ${
          status === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
      
      <p className="mt-3 text-xs text-gray-500 text-center">
        Free forever. Unsubscribe anytime. No spam, just beautiful colours.
      </p>
    </div>
  );
}
