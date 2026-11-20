import { Pencil, Users, Palette } from 'lucide-react';
import Link from 'next/link';
import { getTodaysColour } from '@/lib/colours';
import EmailSignupForm from '@/components/EmailSignupForm';
import ColourGame from '@/components/ColourGame';

export default function HomePage() {
  const todaysColour = getTodaysColour();
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate if color is light or dark for better contrast
  const isLightColor = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff; 
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128;
  };

  const isLight = isLightColor(todaysColour.hex);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Hero Section - Color Game */}
      <div className="bg-white dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Daily CSS Color
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Build your CSS colour vocabulary with random practice and a three-stage Gauntlet.
            </p>
          </div>
          
          {/* Color Game - Now the main attraction */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-700 dark:to-neutral-600 max-w-2xl mx-auto rounded-2xl shadow-lg p-5 sm:p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                CSS Color Challenge
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                How well do you know your CSS colors? Test your skills and beat your high score!
              </p>
            </div>
            <ColourGame />
          </div>
        </div>
      </div>

      {/* Today's Color - Now secondary */}
      <div className="bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Today&apos;s Featured Color
              </h2>
              <div className="flex justify-center mb-6">
                <div 
                  className="w-24 h-24 rounded-lg border-4 border-gray-200 shadow-lg"
                  style={{ backgroundColor: todaysColour.hex }}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {todaysColour.name}
              </h3>
              <p className="text-lg font-mono text-gray-600 dark:text-gray-300 mb-4">
                {todaysColour.hex}
              </p>
              {todaysColour.notes && (
                <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6 text-sm">
                  {todaysColour.notes}
                </p>
              )}
              
              {/* Creative Prompt */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-700 dark:to-neutral-600 rounded-lg p-4 max-w-lg mx-auto mb-6 border border-gray-200 dark:border-neutral-600">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Create & Share</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Make something beautiful with {todaysColour.name} and share it with <span className="font-mono font-semibold">#dailycsscolor</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Ideas include digital art, logo design, CSS animation, photography and crafts.
                </p>
              </div>
              
              <Link
                href={`/colour/${today}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: todaysColour.hex,
                  color: isLight ? '#1f2937' : '#ffffff',
                  boxShadow: `0 4px 15px ${todaysColour.hex}40`
                }}
              >
                Get Color Values & CSS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Email Signup */}
      <div className="bg-gray-50 dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Join the Creative Community
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get daily color challenges delivered to your inbox every morning. Create art, share your work, and discover what others make with the same color.
            </p>
            <div className="mt-8">
              <EmailSignupForm todaysColor={todaysColour.hex} isLightColor={isLight} />
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              One reference colour each day. Practice rounds are random.
            </p>
          </div>
        </div>
      </div>

      {/* Community Call-to-Action */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 dark:from-neutral-700 dark:to-neutral-600 rounded-xl p-8 text-center text-white border border-gray-200 dark:border-neutral-600">
          <h2 className="text-3xl font-bold mb-4">Join the Creative Community</h2>
          <p className="text-xl mb-6 opacity-90">
            Share your high scores and daily color creations with <span className="font-mono font-bold">#dailycsscolor</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#game-title" className="px-6 py-3 bg-white text-purple-700 rounded-md font-semibold hover:bg-gray-100">Play and copy your score</a>
          </div>
          <p className="mt-4 text-sm opacity-75">
            Copy your actual practice best from the game, then share it wherever you like.
          </p>
        </div>
      </div>

      {/* Sample Colours */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Explore Colors
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
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
              <p className="text-xs font-medium text-gray-900 dark:text-white">{colour.name}</p>
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
              <Pencil className="w-8 h-8 text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Creative Challenges</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get a new color and creative prompt every morning. Turn inspiration into actual art and share your creations.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Creative Community</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Make something with the reference colour and share it using #dailycsscolor.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your own colour studies</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try a colour study in your own tools, from digital art to photography. There is no upload gallery on this site.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2026 Daily CSS Color. For designers and developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
