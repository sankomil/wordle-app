import React, { useEffect, useState } from "react";
import { Keypad, GameBoard } from "./components";
import "./App.css";
import { useWordle } from "./hooks";

function App() {
  const [selectedWord, setSelectedWord] = useState<string>("");

  useEffect(() => {
    const wordList = JSON.parse(process.env.REACT_APP_WORDLE_LIST || "[]");
    setSelectedWord(
      wordList[Math.floor(Math.random() * wordList.length)].toUpperCase()
    );
  }, [setSelectedWord]);

  const {
    currentGuess,
    attempts,
    handleButtonPress,
    handleKeyPress,
    turn,
    guesses,
    previousLetters,
    gameOver,
  } = useWordle(selectedWord);

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
