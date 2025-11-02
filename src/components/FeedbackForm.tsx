'use client';

import { useState } from 'react';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('general');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setStatus('error');
      setMessage('Please enter your feedback');
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback,
          email,
          category,
        }),
      });
      
      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for your feedback! We read every submission.');
        setFeedback('');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again or email hello@thecolorgame.uk');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again or email hello@thecolorgame.uk');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Feedback Type
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="general">General Feedback</option>
          <option value="content">Email Content</option>
          <option value="colors">Color Suggestions</option>
          <option value="features">Feature Requests</option>
          <option value="bug">Bug Report</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
          Your Feedback
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={6}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us what you think about Daily CSS Color..."
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="your-email@example.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional - only if you want a response
        </p>
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Feedback'}
      </button>
      
      {message && (
        <div className={`text-sm text-center ${
          status === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}
