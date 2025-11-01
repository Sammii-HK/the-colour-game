'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribeForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const [email, setEmail] = useState(emailParam || '');
  
  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from daily color emails.');
      } else {
        const data = await response.json() as { error?: string };
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleUnsubscribe}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="your-email@example.com"
          disabled={status === 'loading'}
        />
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
      </button>
      
      {message && (
        <div className={`mt-4 text-sm text-center ${
          status === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
      
      {status === 'success' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            We'd love your feedback
          </h3>
          <p className="text-sm text-gray-600">
            Was there something we could have done better? 
            <a href="mailto:hello@thecolorgame.uk" className="text-blue-600 hover:text-blue-700">
              Let us know
            </a>
          </p>
        </div>
      )}
    </form>
  );
}
