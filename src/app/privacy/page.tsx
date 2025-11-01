export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2>Information We Collect</h2>
            <p>
              We collect email addresses when you subscribe to our daily color emails. We also collect basic usage analytics to improve our service.
            </p>
            
            <h2>How We Use Your Information</h2>
            <p>
              Your email address is used solely to send you daily CSS color emails. We do not share, sell, or rent your email address to third parties.
            </p>
            
            <h2>Email Communications</h2>
            <p>
              By subscribing, you agree to receive daily emails from Daily CSS Color. You can unsubscribe at any time using the link in our emails or by visiting our unsubscribe page.
            </p>
            
            <h2>Data Storage</h2>
            <p>
              Your data is stored securely using industry-standard practices. We use Supabase for database hosting and AWS SES for email delivery.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. Contact us at hello@thecolorgame.uk for any data requests.
            </p>
            
            <h2>Contact</h2>
            <p>
              If you have questions about this privacy policy, contact us at hello@thecolorgame.uk
            </p>
            
            <p className="text-sm text-gray-500 mt-8">
              Last updated: November 1, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
