import { useState, useEffect } from "react";
import "./App.css";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#FFB347",
];

const GAME_STATES = {
  IDLE: "idle",
  SHOWING: "showing",
  PLAYING: "playing",
  GAME_OVER: "game_over",
};

function App() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [score, setScore] = useState(0);
  const [activeColor, setActiveColor] = useState(null);
  const [showSequence, setShowSequence] = useState(false);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameState(GAME_STATES.PLAYING);
    addToSequence();
  };

  const addToSequence = () => {
    const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    showSequenceToPlayer(newSequence);
  };

  const showSequenceToPlayer = (seq) => {
    setGameState(GAME_STATES.SHOWING);
    setShowSequence(true);

    seq.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color);
        setTimeout(() => setActiveColor(null), 500);
      }, (index + 1) * 800);
    });

    setTimeout(() => {
      setGameState(GAME_STATES.PLAYING);
      setShowSequence(false);
    }, seq.length * 800 + 500);
  };

  const handleColorClick = (color) => {
    if (gameState !== GAME_STATES.PLAYING || showSequence) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Flash the clicked color
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    // Check if the player's sequence matches so far
    const isCorrect = newPlayerSequence.every(
      (playerColor, index) => playerColor === sequence[index]
    );

    if (!isCorrect) {
      setGameState(GAME_STATES.GAME_OVER);
      return;
    }

    // If player completed the sequence correctly
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setPlayerSequence([]);
      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameState(GAME_STATES.IDLE);
    setActiveColor(null);
    setShowSequence(false);
  };

  return (
    <div className="game-container">
      <h1>🧠 Memory Game</h1>

      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="status">
          {gameState === GAME_STATES.IDLE && "Press Start to begin!"}
          {gameState === GAME_STATES.SHOWING && "Watch the sequence..."}
          {gameState === GAME_STATES.PLAYING &&
            "Your turn! Click the colors in order"}
          {gameState === GAME_STATES.GAME_OVER &&
            `Game Over! Final Score: ${score}`}
        </div>
      </div>

      <div className="color-grid">
        {COLORS.map((color, index) => (
          <button
            key={index}
            className={`color-button ${activeColor === color ? "active" : ""}`}
            style={{
              backgroundColor: color,
              opacity: activeColor === color ? 1 : 0.7,
              transform: activeColor === color ? "scale(1.1)" : "scale(1)",
            }}
            onClick={() => handleColorClick(color)}
            disabled={gameState === GAME_STATES.SHOWING || showSequence}
          />
        ))}
      </div>

      <div className="controls">
        {gameState === GAME_STATES.IDLE && (
          <button className="start-button" onClick={startGame}>
            🚀 Start Game
          </button>
        )}
        {(gameState === GAME_STATES.GAME_OVER ||
          gameState === GAME_STATES.PLAYING) && (
          <button className="reset-button" onClick={resetGame}>
            🔄 Reset Game
          </button>
        )}
      </div>

      <div className="instructions">
        <h3>How to play:</h3>
        <ul>
          <li>🎯 Watch the sequence of colors carefully</li>
          <li>🖱️ Click the colors in the same order</li>
          <li>📈 Each round adds one more color to remember</li>
          <li>🏆 See how high you can score!</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
