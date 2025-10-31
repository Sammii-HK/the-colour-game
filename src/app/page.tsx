import Link from 'next/link';
import { getTodaysColour } from '@/lib/colours';
import EmailSignupForm from '@/components/EmailSignupForm';
import ColourGame from '@/components/ColourGame';

export default function HomePage() {
  const todaysColour = getTodaysColour();
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Color Game */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Daily CSS Color
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Test your CSS color knowledge, discover new colors daily, and join the creative community!
            </p>
          </div>
          
          {/* Color Game - Now the main attraction */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎮 CSS Color Challenge
              </h2>
              <p className="text-gray-600">
                How well do you know your CSS colors? Test your skills and beat your high score!
              </p>
            </div>
            <ColourGame />
          </div>
        </div>
      </div>

      {/* Today's Color - Now secondary */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Today&apos;s Featured Color
              </h2>
              <div className="flex justify-center mb-6">
                <div 
                  className="w-24 h-24 rounded-lg border-4 border-gray-200 shadow-lg"
                  style={{ backgroundColor: todaysColour.hex }}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {todaysColour.name}
              </h3>
              <p className="text-lg font-mono text-gray-600 mb-4">
                {todaysColour.hex}
              </p>
              {todaysColour.notes && (
                <p className="text-gray-700 max-w-md mx-auto mb-6 text-sm">
                  {todaysColour.notes}
                </p>
              )}
              
              {/* Creative Prompt */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 max-w-lg mx-auto mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">🎨 Create & Share</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Make something beautiful with {todaysColour.name} and share it with <span className="font-mono font-semibold">#dailycsscolor</span>
                </p>
                <p className="text-xs text-gray-600">
                  💡 Ideas: Digital art • Logo design • CSS animations • Photography • Crafts
                </p>
              </div>
              
              <Link
                href={`/colour/${today}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Color Values & CSS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Email Signup */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Join the Creative Community
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get daily color challenges delivered to your inbox every morning. Create art, share your work, and discover what others make with the same color.
            </p>
            <div className="mt-8">
              <EmailSignupForm />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Join 1000+ artists and designers exploring color creativity together
            </p>
          </div>
        </div>
      </div>

      {/* Community Call-to-Action */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join the Creative Community</h2>
          <p className="text-xl mb-6 opacity-90">
            Share your high scores and daily color creations with <span className="font-mono font-bold">#dailycsscolor</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://twitter.com/intent/tweet?text=I just scored [SCORE] points on the Daily CSS Color Challenge! 🎨 Can you beat my score? %23dailycsscolor" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-purple-600 rounded-md font-semibold hover:bg-gray-100"
            >
              Share on Twitter
            </a>
            <a 
              href="https://www.instagram.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white text-white rounded-md font-semibold hover:bg-white hover:text-purple-600"
            >
              Share on Instagram
            </a>
          </div>
          <p className="mt-4 text-sm opacity-75">
            Follow us for daily inspiration and see what amazing things the community creates!
          </p>
        </div>
      </div>

      {/* Sample Colours */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Explore Colors
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover the beautiful CSS colours that inspire daily creativity
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


      {/* Features */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Creative Challenges</h3>
            <p className="text-gray-600">
              Get a new color and creative prompt every morning. Turn inspiration into actual art and share your creations.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Creative Community</h3>
            <p className="text-gray-600">
              Join 1000+ artists, designers, and creators. Share your work, get inspired by others, and grow together.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Art Gallery</h3>
            <p className="text-gray-600">
              Showcase your creations in our community gallery. From digital art to photography, all mediums welcome.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Daily CSS Color. Made with ❤️ for designers and developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
