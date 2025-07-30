import React, { useEffect } from "react";
import { Keypad, GameBoard } from "./components";
import "./App.css";
import { useWordle } from "./hooks";

function App() {
  const {
    currentGuess,
    attempts,
    handleButtonPress,
    handleKeyPress,
    turn,
    guesses,
    previousLetters,
    gameOver,
    selectedWord,
  } = useWordle();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="App">
      <div className="game-message">
        {gameOver.isOver ? (
          gameOver.isVictory ? (
            <div className="victory-overlay"></div>
          ) : (
            <div className="lose-state">{selectedWord}</div>
          )
        ) : null}
      </div>
      <div className="game-space">
        <GameBoard
          currentGuess={currentGuess}
          turn={turn}
          attempts={attempts}
          guesses={guesses}
        />
        <Keypad
          handleButtonPress={handleButtonPress}
          previousLetters={previousLetters}
        />
      </div>
    </div>
  );
}

export default App;
