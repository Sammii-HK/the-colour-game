import FeedbackForm from '@/components/FeedbackForm';

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Feedback & Suggestions
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Help us improve Daily CSS Colour. Your feedback shapes what we make next.
            </p>
          </div>
          
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
}
