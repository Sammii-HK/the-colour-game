import Link from 'next/link';
import { getTodaysColour } from '@/lib/colours';
import EmailSignupForm from '@/components/EmailSignupForm';
import ColourGame from '@/components/ColourGame';

export default function HomePage() {
  const todaysColour = getTodaysColour();
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Daily CSS Colour
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover a new CSS named colour every day. Get inspired, learn colour theory, and build beautiful designs.
            </p>
          </div>
        </div>
      </div>

      {/* Today's Colour */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Today's Colour
            </h2>
            <div className="flex justify-center mb-6">
              <div 
                className="w-32 h-32 rounded-lg border-4 border-gray-200 shadow-lg"
                style={{ backgroundColor: todaysColour.hex }}
              />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {todaysColour.name}
            </h3>
            <p className="text-lg font-mono text-gray-600 mb-4">
              {todaysColour.hex}
            </p>
            {todaysColour.notes && (
              <p className="text-gray-700 max-w-md mx-auto mb-6">
                {todaysColour.notes}
              </p>
            )}
            <Link
              href={`/colour/${today}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>

      {/* Email Signup */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Never Miss a Colour
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get a beautiful CSS colour delivered to your inbox every morning at 7:30 AM London time.
            </p>
            <div className="mt-8">
              <EmailSignupForm />
            </div>
          </div>
        </div>
      </div>

      {/* Sample Colours */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Sample Colours
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Here are some of the beautiful CSS colours you&apos;ll discover
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'CornflowerBlue', hex: '#6495ED' },
            { name: 'Coral', hex: '#FF7F50' },
            { name: 'MediumSeaGreen', hex: '#3CB371' },
            { name: 'DarkOrchid', hex: '#9932CC' },
            { name: 'Tomato', hex: '#FF6347' },
            { name: 'SteelBlue', hex: '#4682B4' },
            { name: 'PaleVioletRed', hex: '#DB7093' },
            { name: 'DarkTurquoise', hex: '#00CED1' },
            { name: 'GoldenRod', hex: '#DAA520' },
            { name: 'MediumPurple', hex: '#9370DB' },
            { name: 'LightSeaGreen', hex: '#20B2AA' },
            { name: 'IndianRed', hex: '#CD5C5C' },
          ].map((colour) => (
            <div key={colour.name} className="text-center">
              <div 
                className="w-full h-20 rounded-lg border-2 border-gray-200 mb-2"
                style={{ backgroundColor: colour.hex }}
              />
              <p className="text-xs font-medium text-gray-900">{colour.name}</p>
              <p className="text-xs text-gray-500 font-mono">{colour.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Colour Game */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Test Your Colour Knowledge
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Play our colour guessing game and improve your CSS colour recognition skills
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ColourGame />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7Z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Delivery</h3>
            <p className="text-gray-600">
              Get a new CSS colour in your inbox every morning, perfectly timed for your design workflow.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 17 21Z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Values</h3>
            <p className="text-gray-600">
              Get HEX, RGB, and HSL values for every colour, plus CSS variables ready to copy and paste.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Design Inspiration</h3>
            <p className="text-gray-600">
              Discover new colours and get inspired with curated descriptions and design suggestions.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Daily CSS Colour. Made with ❤️ for designers and developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
