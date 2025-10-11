'use client'

import React, { useState, useEffect } from "react";
// import "./App.css";

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

const App = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [correctColor, setCorrectColor] = useState(getRandomColorFromGroup(getRandomGroup()));
  const [options, setOptions] = useState(generateOptions(correctColor, difficulty));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");

  useEffect(() => setOptions(generateOptions(correctColor, difficulty)), [correctColor, difficulty]);

  const handleGuess = (guess: string) => {
    if (guess === correctColor) {
      setMessage("Correct!");
      setScore(score + 10);
      setStreak(streak + 1);
      setHighScore(Math.max(highScore, score + 10));
    } else {
      setMessage(`Wrong! The correct answer was ${correctColor}`);
      setScore(0);
      setStreak(0);
    }
    setTimeout(() => {
      const newColor = getRandomColorFromGroup(getRandomGroup());
      setCorrectColor(newColor);
      setOptions(generateOptions(newColor, difficulty));
      setMessage("");
      setUserInput("");
    }, 1000);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Guess the CSS Color</h1>
      <h3>Difficulty: {difficulty.toUpperCase()}</h3>
      <button onClick={() => setDifficulty("easy")}>Easy</button>
      <button onClick={() => setDifficulty("medium")}>Medium</button>
      <button onClick={() => setDifficulty("hard")}>Hard</button>

      <div style={{ width: "150px", height: "150px", backgroundColor: correctColor, margin: "20px auto", border: "2px solid black" }} />

      {difficulty === "hard" ? (
        <div>
          <input 
            type="text" 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value.toLowerCase())} 
            onKeyPress={(e) => e.key === 'Enter' && handleGuess(userInput)}
            style={{ border: "0.5px solid black", padding: "10px", margin: "10px" }} 
            placeholder="Type the color name..."
          />
          <br />
          <button onClick={() => handleGuess(userInput)} style={{ margin: "5px", padding: "10px", border: "1px solid black", cursor: "pointer" }}>
            Submit
          </button>
        </div>
      ) : (
        <div>
          {options.map((color) => (
            <button key={color} onClick={() => handleGuess(color)} style={{ margin: "5px", padding: "10px", border: "1px solid black", cursor: "pointer", backgroundColor: "white" }}>
              {color}
            </button>
          ))}
        </div>
      )}

      <h3>{message}</h3>
      <h3>Score: {score}</h3>
      <h3>Streak: {streak}</h3>
      <h3>High Score: {highScore}</h3>
    </div>
  );
};

export default App;
