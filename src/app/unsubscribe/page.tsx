import { Suspense } from 'react';
import UnsubscribeForm from '@/components/UnsubscribeForm';

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unsubscribe from Daily CSS Color
          </h1>
          <p className="text-gray-600">
            We're sorry to see you go. You can unsubscribe from our daily color emails below.
          </p>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <UnsubscribeForm />
        </Suspense>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Daily CSS Color
          </a>
        </div>
      </div>
    </div>
  );
}
