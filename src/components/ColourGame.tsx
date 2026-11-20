'use client';

import React, { useState, useEffect } from "react";

type ColorGroup = keyof typeof COLOR_GROUPS;
type Difficulty = "easy" | "medium" | "hard";
type GameMode = "normal" | "gauntlet";

const GAUNTLET_MULTIPLIERS: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };
const GAUNTLET_PROMOTE_THRESHOLD = 3;
const GAUNTLET_STAGES: Difficulty[] = ["easy", "medium", "hard"];

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

// Date helpers for daily streak
const formatDateObj = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const getTodayString = (): string => formatDateObj(new Date());

const calculateStreak = (history: string[]): number => {
  if (history.length === 0) return 0;
  const historySet = new Set(history);
  if (!historySet.has(getTodayString())) return 0;
  let streak = 1;
  const d = new Date();
  d.setDate(d.getDate() - 1);
  while (historySet.has(formatDateObj(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

const getLast30Days = (): string[] => {
  const days: string[] = [];
  const d = new Date();
  for (let i = 29; i >= 0; i--) {
    const day = new Date(d);
    day.setDate(day.getDate() - i);
    days.push(formatDateObj(day));
  }
  return days;
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

  // Gauntlet mode
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [gauntletStage, setGauntletStage] = useState<Difficulty>("easy");
  const [gauntletScore, setGauntletScore] = useState(0);
  const [gauntletCorrectCount, setGauntletCorrectCount] = useState(0);
  const [gauntletGameOver, setGauntletGameOver] = useState(false);
  const [gauntletStats, setGauntletStats] = useState<{ easy: number; medium: number; hard: number }>({ easy: 0, medium: 0, hard: 0 });

  // Daily streak
  const [dailyStreak, setDailyStreak] = useState(0);
  const [playHistory, setPlayHistory] = useState<string[]>([]);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  // Initialize game and load saved data on client side only
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

      // Load play history
      const savedHistory = localStorage.getItem('dailycsscolor-play-history');
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory) as string[];
          setPlayHistory(history);
          setDailyStreak(calculateStreak(history));
          setHasPlayedToday(history.includes(getTodayString()));
        } catch {
          // Invalid data, start fresh
        }
      }
    }
  }, []);

  useEffect(() => {
    if (correctColor) {
      setOptions(generateOptions(correctColor, difficulty));
    }
  }, [correctColor, difficulty]);

  // Record today's play
  const recordPlay = () => {
    if (typeof window === 'undefined') return;
    const today = getTodayString();
    if (playHistory.includes(today)) return;

    const newHistory = [...playHistory, today].slice(-365);
    setPlayHistory(newHistory);
    setHasPlayedToday(true);
    setDailyStreak(calculateStreak(newHistory));
    localStorage.setItem('dailycsscolor-play-history', JSON.stringify(newHistory));
  };

  const effectiveDifficulty = gameMode === "gauntlet" ? gauntletStage : difficulty;

  const startGauntlet = () => {
    setGameMode("gauntlet");
    setGauntletStage("easy");
    setGauntletScore(0);
    setGauntletCorrectCount(0);
    setGauntletGameOver(false);
    setGauntletStats({ easy: 0, medium: 0, hard: 0 });
    setMessage("");
    setWrongAnswerData(null);
    const newColor = getRandomColorFromGroup(getRandomGroup());
    setCorrectColor(newColor);
    setOptions(generateOptions(newColor, "easy"));
  };

  const handleGuess = (guess: string) => {
    // Record play on first guess of the day
    recordPlay();

    if (gameMode === "gauntlet") {
      if (guess === correctColor) {
        const points = 10 * GAUNTLET_MULTIPLIERS[gauntletStage];
        const newGauntletScore = gauntletScore + points;
        setGauntletScore(newGauntletScore);
        setGauntletStats(prev => ({ ...prev, [gauntletStage]: prev[gauntletStage] + 1 }));
        const newCorrectCount = gauntletCorrectCount + 1;
        setGauntletCorrectCount(newCorrectCount);
        setMessage("Correct! \ud83c\udf89");
        setWrongAnswerData(null);

        setTimeout(() => {
          // Check for promotion
          if (newCorrectCount >= GAUNTLET_PROMOTE_THRESHOLD) {
            const currentIdx = GAUNTLET_STAGES.indexOf(gauntletStage);
            if (currentIdx < GAUNTLET_STAGES.length - 1) {
              const nextStage = GAUNTLET_STAGES[currentIdx + 1];
              setGauntletStage(nextStage);
              setGauntletCorrectCount(0);
              const newColor = getRandomColorFromGroup(getRandomGroup());
              setCorrectColor(newColor);
              setOptions(generateOptions(newColor, nextStage));
            } else {
              // Already on hard, just keep going
              setGauntletCorrectCount(0);
              const newColor = getRandomColorFromGroup(getRandomGroup());
              setCorrectColor(newColor);
              setOptions(generateOptions(newColor, gauntletStage));
            }
          } else {
            const newColor = getRandomColorFromGroup(getRandomGroup());
            setCorrectColor(newColor);
            setOptions(generateOptions(newColor, gauntletStage));
          }
          setMessage("");
          setUserInput("");
        }, 1500);
      } else {
        // Wrong answer ends the gauntlet
        setWrongAnswerData({
          guessed: guess,
          correct: correctColor,
          isValidColor: ALL_COLOR_NAMES.has(guess),
        });
        setMessage("Wrong!");
        setTimeout(() => {
          setGauntletGameOver(true);
          setMessage("");
          setWrongAnswerData(null);
        }, 2500);
      }
    } else {
      // Normal mode
      if (guess === correctColor) {
        setMessage("Correct! \ud83c\udf89");
        setWrongAnswerData(null);
        const newScore = score + 10;
        setScore(newScore);
        setStreak(streak + 1);

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
        setWrongAnswerData({
          guessed: guess,
          correct: correctColor,
          isValidColor: ALL_COLOR_NAMES.has(guess),
        });
        setMessage("Wrong!");
        setScore(0);
        setStreak(0);

        setTimeout(() => {
          const newColor = getRandomColorFromGroup(getRandomGroup());
          setCorrectColor(newColor);
          setOptions(generateOptions(newColor, difficulty));
          setMessage("");
          setUserInput("");
          setWrongAnswerData(null);
        }, 2500);
      }
    }

    // Track analytics
    if (typeof window !== 'undefined' && 'plausible' in window) {
      const plausible = (window as unknown as { plausible?: (event: string, opts: { props: Record<string, unknown> }) => void }).plausible;
      if (typeof plausible === 'function') {
        plausible('Colour Game Guess', {
          props: {
            difficulty: effectiveDifficulty,
            correct: guess === correctColor,
            score: guess === correctColor ? (gameMode === "gauntlet" ? gauntletScore + 10 * GAUNTLET_MULTIPLIERS[gauntletStage] : score + 10) : 0
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

  const last30Days = getLast30Days();
  const historySet = new Set(playHistory);

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Guess the CSS Color</h3>

      {/* Difficulty Selector */}
      <div className="mb-6">
        {gameMode === "gauntlet" ? (
          <p className="text-sm font-semibold mb-2" style={{ color: '#a855f7' }}>
            GAUNTLET: {gauntletStage.charAt(0).toUpperCase() + gauntletStage.slice(1)} ({GAUNTLET_MULTIPLIERS[gauntletStage]}x)
          </p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Difficulty: {difficulty.toUpperCase()}</p>
        )}
        {gameMode !== "gauntlet" && (
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
            <button
              onClick={startGauntlet}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 cursor-pointer bg-transparent hover:bg-gray-50 dark:hover:bg-neutral-700"
              style={{ borderColor: '#a855f7', color: '#a855f7' }}
            >
              Gauntlet
            </button>
          </div>
        )}
        {gameMode === "gauntlet" && !gauntletGameOver && (
          <button
            onClick={() => setGameMode("normal")}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline mt-1"
          >
            Exit Gauntlet
          </button>
        )}
      </div>

      {/* Gauntlet Game Over Summary */}
      {gameMode === "gauntlet" && gauntletGameOver ? (
        <div className="mb-6 p-6 rounded-xl border-2" style={{ borderColor: '#a855f7' }}>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Gauntlet Over!</h4>
          <p className="text-3xl font-bold mb-4" style={{ color: '#a855f7' }}>{gauntletScore} pts</p>
          <div className="flex justify-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <span className="font-medium" style={{ color: '#10b981' }}>Easy:</span> {gauntletStats.easy}
            </div>
            <div>
              <span className="font-medium" style={{ color: '#f59e0b' }}>Medium:</span> {gauntletStats.medium}
            </div>
            <div>
              <span className="font-medium" style={{ color: '#ef4444' }}>Hard:</span> {gauntletStats.hard}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Total correct: {gauntletStats.easy + gauntletStats.medium + gauntletStats.hard}
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={startGauntlet}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: '#a855f7' }}
            >
              Play Again
            </button>
            <button
              onClick={() => setGameMode("normal")}
              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
              Back to Normal
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Color Swatch */}
          <div
            className="w-32 h-32 mx-auto mb-6 rounded-lg border-4 border-gray-300 dark:border-neutral-600 shadow-lg"
            style={{ backgroundColor: correctColor || '#f3f4f6' }}
          />

          {/* Game Interface - Only show when color is loaded */}
          {correctColor && (effectiveDifficulty === "hard" ? (
            <div className="mb-6">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toLowerCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleGuess(userInput)}
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
        </>
      )}

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
            {effectiveDifficulty === "hard" && wrongAnswerData.isValidColor && (
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
        {gameMode === "gauntlet" && !gauntletGameOver ? (
          <>
            <div>Gauntlet Score: <span className="font-medium" style={{ color: '#a855f7' }}>{gauntletScore}</span></div>
            <div>Correct: <span className="font-medium text-gray-900 dark:text-white">{gauntletCorrectCount}/{GAUNTLET_PROMOTE_THRESHOLD}</span></div>
          </>
        ) : (
          <>
            <div>Score: <span className="font-medium text-gray-900 dark:text-white">{score}</span></div>
            <div>Streak: <span className="font-medium text-gray-900 dark:text-white">{streak}</span></div>
            <div>High Score: <span className="font-medium text-gray-900 dark:text-white">{highScore}</span></div>
          </>
        )}
      </div>

      {/* Daily Streak & Calendar Heatmap */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg">&#x1f525;</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {dailyStreak} day{dailyStreak !== 1 ? 's' : ''} streak
          </span>
        </div>
        {!hasPlayedToday && playHistory.length > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">Play today to start a new streak!</p>
        )}
        {hasPlayedToday && dailyStreak > 0 && (
          <p className="text-xs text-green-600 dark:text-green-400 mb-2">Come back tomorrow to keep your streak!</p>
        )}
        <div className="inline-grid grid-cols-7 gap-1">
          {last30Days.map((day) => (
            <div
              key={day}
              className={`w-3 h-3 rounded-sm ${
                historySet.has(day) ? 'bg-green-500' : 'bg-gray-200 dark:bg-neutral-700'
              }`}
              title={day}
            />
          ))}
        </div>
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
