'use client';

import React, { useState, useEffect } from "react";

type ColorGroup = keyof typeof COLOR_GROUPS;
type Difficulty = "easy" | "medium" | "hard";

const COLOR_GROUPS = {
  red: ["indianred", "lightcoral", "salmon", "darkred", "red", "firebrick", "crimson"],
  orange: ["lightsalmon", "coral", "tomato", "orangered", "darkorange", "orange"],
  yellow: ["gold", "yellow", "lightyellow", "lemonchiffon", "papayawhip", "moccasin", "peachpuff"],
  green: ["darkgreen", "green", "forestgreen", "limegreen", "lime", "lawngreen", "chartreuse", "lightgreen", "palegreen", "springgreen"],
  cyan: ["teal", "darkcyan", "cadetblue", "darkturquoise", "mediumturquoise", "turquoise", "lightseagreen", "aquamarine", "aqua", "cyan", "paleturquoise", "lightcyan"],
  blue: ["midnightblue", "navy", "darkblue", "mediumblue", "blue", "royalblue", "dodgerblue", "deepskyblue", "lightskyblue", "skyblue", "lightblue", "powderblue"],
  purple: ["indigo", "purple", "darkmagenta", "darkviolet", "blueviolet", "mediumpurple", "orchid", "violet", "plum", "thistle", "lavender"],
  pink: ["deeppink", "hotpink", "palevioletred", "lightpink", "pink"],
  brown: ["saddlebrown", "sienna", "chocolate", "peru", "darkgoldenrod", "goldenrod", "sandybrown", "rosybrown", "burlywood", "tan", "wheat"],
  gray: ["black", "dimgray", "gray", "darkgray", "silver", "lightgray", "gainsboro", "whitesmoke", "white"],
};

// Set of all valid color names in the game
const ALL_COLOR_NAMES = new Set(Object.values(COLOR_GROUPS).flat());

// Check if two colors are in the same color group
const isInSameGroup = (color1: string, color2: string): boolean => {
  for (const colors of Object.values(COLOR_GROUPS)) {
    if (colors.includes(color1) && colors.includes(color2)) return true;
  }
  return false;
};

const getRandomGroup = (): ColorGroup => Object.keys(COLOR_GROUPS)[Math.floor(Math.random() * Object.keys(COLOR_GROUPS).length)] as ColorGroup;
const getRandomColorFromGroup = (group: ColorGroup): string => COLOR_GROUPS[group][Math.floor(Math.random() * COLOR_GROUPS[group].length)];

const generateOptions = (correctColor: string, difficulty: Difficulty): string[] => {
  const options = [correctColor];
  if (difficulty === "easy") {
    while (options.length < 4) {
      const newColor = getRandomColorFromGroup(getRandomGroup());
      if (!options.includes(newColor)) options.push(newColor);
    }
  } else if (difficulty === "medium") {
    const group = Object.keys(COLOR_GROUPS).find((g) => COLOR_GROUPS[g as ColorGroup].includes(correctColor)) as ColorGroup;
    while (options.length < 4) {
      const newColor = getRandomColorFromGroup(group);
      if (!options.includes(newColor)) options.push(newColor);
    }
  }
  return options.sort(() => Math.random() - 0.5);
};

export default function ColourGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [correctColor, setCorrectColor] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");

  // Wrong answer feedback
  const [wrongAnswerData, setWrongAnswerData] = useState<{
    guessed: string;
    correct: string;
    isValidColor: boolean;
  } | null>(null);

  // Initialize game and load high score on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial color and options on client side to avoid hydration mismatch
      const initialColor = getRandomColorFromGroup(getRandomGroup());
      setCorrectColor(initialColor);
      setOptions(generateOptions(initialColor, difficulty));

      // Load high score from localStorage
      const savedHighScore = localStorage.getItem('dailycsscolor-highscore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (correctColor) {
      setOptions(generateOptions(correctColor, difficulty));
    }
  }, [correctColor, difficulty]);

  const handleGuess = (guess: string) => {
    if (guess === correctColor) {
      setMessage("Correct! \ud83c\udf89");
      setWrongAnswerData(null);
      const newScore = score + 10;
      setScore(newScore);
      setStreak(streak + 1);

      // Update high score and save to localStorage
      const newHighScore = Math.max(highScore, newScore);
      setHighScore(newHighScore);

      if (typeof window !== 'undefined') {
        localStorage.setItem('dailycsscolor-highscore', newHighScore.toString());
      }

      setTimeout(() => {
        const newColor = getRandomColorFromGroup(getRandomGroup());
        setCorrectColor(newColor);
        setOptions(generateOptions(newColor, difficulty));
        setMessage("");
        setUserInput("");
      }, 1500);
    } else {
      // Set wrong answer data for side-by-side display
      setWrongAnswerData({
        guessed: guess,
        correct: correctColor,
        isValidColor: ALL_COLOR_NAMES.has(guess),
      });
      setMessage("Wrong!");
      setScore(0);
      setStreak(0);

      // Extended delay for wrong answers (2500ms vs 1500ms)
      setTimeout(() => {
        const newColor = getRandomColorFromGroup(getRandomGroup());
        setCorrectColor(newColor);
        setOptions(generateOptions(newColor, difficulty));
        setMessage("");
        setUserInput("");
        setWrongAnswerData(null);
      }, 2500);
    }

    // Track analytics
    if (typeof window !== 'undefined' && 'plausible' in window) {
      const plausible = (window as unknown as { plausible?: (event: string, opts: { props: Record<string, unknown> }) => void }).plausible;
      if (typeof plausible === 'function') {
        plausible('Colour Game Guess', {
          props: {
            difficulty,
            correct: guess === correctColor,
            score: guess === correctColor ? score + 10 : 0
          }
        });
      }
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return { bg: '#10b981', hover: '#059669' }; // Green
      case 'medium': return { bg: '#f59e0b', hover: '#d97706' }; // Orange
      case 'hard': return { bg: '#ef4444', hover: '#dc2626' }; // Red
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Guess the CSS Color</h3>

      {/* Difficulty Selector */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Difficulty: {difficulty.toUpperCase()}</p>
        <div className="flex justify-center gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
            const colors = getDifficultyColor(diff);
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 cursor-pointer ${
                  difficulty === diff
                    ? 'bg-white dark:bg-neutral-800 shadow-lg'
                    : 'bg-transparent hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
                style={{
                  borderColor: difficulty === diff ? colors.bg : '#d1d5db',
                  color: difficulty === diff ? colors.bg : undefined
                }}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Swatch */}
      <div
        className="w-32 h-32 mx-auto mb-6 rounded-lg border-4 border-gray-300 dark:border-neutral-600 shadow-lg"
        style={{ backgroundColor: correctColor || '#f3f4f6' }}
      />

      {/* Game Interface - Only show when color is loaded */}
      {correctColor && (difficulty === "hard" ? (
        <div className="mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toLowerCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess(userInput)}
            className="block w-full max-w-xs mx-auto px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-neutral-400 focus:border-gray-500 dark:focus:border-neutral-400 mb-3"
            placeholder="Type the color name..."
          />
          <button
            onClick={() => handleGuess(userInput)}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
            {options.map((color) => (
              <button
                key={color}
                onClick={() => handleGuess(color)}
                className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-neutral-500 transition-all duration-200"
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Message & Wrong Answer Feedback */}
      {message && (
        wrongAnswerData ? (
          <div className="mb-4">
            <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Wrong!</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-neutral-600 mx-auto"
                  style={{ backgroundColor: wrongAnswerData.isValidColor ? wrongAnswerData.guessed : '#9ca3af' }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your guess</p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {wrongAnswerData.isValidColor ? wrongAnswerData.guessed : 'Not a valid color'}
                </p>
              </div>
              <span className="text-gray-400 font-medium">vs</span>
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-neutral-600 mx-auto"
                  style={{ backgroundColor: wrongAnswerData.correct }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Correct</p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{wrongAnswerData.correct}</p>
              </div>
            </div>
            {difficulty === "hard" && wrongAnswerData.isValidColor && (
              <p className="text-xs mt-2" style={{
                color: isInSameGroup(wrongAnswerData.guessed, wrongAnswerData.correct) ? '#10b981' : '#ef4444'
              }}>
                {isInSameGroup(wrongAnswerData.guessed, wrongAnswerData.correct)
                  ? 'Same color family!'
                  : 'Different color family'}
              </p>
            )}
          </div>
        ) : (
          <div className="text-lg font-medium mb-4 text-green-600 dark:text-green-400">
            {message}
          </div>
        )
      )}

      {/* Score */}
      <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-4">
        <div>Score: <span className="font-medium text-gray-900 dark:text-white">{score}</span></div>
        <div>Streak: <span className="font-medium text-gray-900 dark:text-white">{streak}</span></div>
        <div>High Score: <span className="font-medium text-gray-900 dark:text-white">{highScore}</span></div>
      </div>

      {/* Share High Score */}
      {highScore > 0 && (
        <div className="text-center space-y-2">
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/api/og/highscore?score=${highScore}&streak=${streak}`;
              const tweetText = `I just scored ${highScore} points on the Daily CSS Color Challenge! \ud83c\udfa8 Can you beat my score? #dailycsscolor`;
              const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
              window.open(twitterUrl, '_blank');

              // Track share event
              if (typeof window !== 'undefined' && 'plausible' in window) {
                const plausible = (window as unknown as { plausible?: (event: string, opts: { props: Record<string, unknown> }) => void }).plausible;
                if (typeof plausible === 'function') {
                  plausible('High Score Share', { props: { score: highScore } });
                }
              }
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
          >
            Share High Score
          </button>
          <div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset your high score?')) {
                  setHighScore(0);
                  localStorage.removeItem('dailycsscolor-highscore');
                }
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Reset High Score
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
