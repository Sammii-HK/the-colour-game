import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import UnsubscribeForm from '@/components/UnsubscribeForm';

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-16">
      <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unsubscribe from Daily CSS Color
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            We&apos;re sorry to see you go. You can unsubscribe from our daily color emails below.
          </p>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <UnsubscribeForm />
        </Suspense>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            <ArrowLeft size={16} aria-hidden="true" className="inline mr-2" /> Back to Daily CSS Color
          </Link>
        </div>
      </div>
    </div>
  );
}
