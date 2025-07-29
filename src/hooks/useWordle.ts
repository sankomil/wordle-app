import { useState } from "react";
import { ILetter } from "../types";

export const useWordle = () => {
  const attempts = parseInt(process.env.REACT_APP_ATTEMPTS || "5");
  const wordList = JSON.parse(process.env.REACT_APP_WORDLE_LIST || "[]");

  const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

  const [guesses, setGuesses] = useState<ILetter[][]>([]);

  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const isGameOver = () => {
    return turn + 1 === attempts || currentGuess === selectedWord;
  };
  const validateCurrGuess = () => {
    let solArray = selectedWord.split("");
    let currGuessArray = currentGuess
      .split("")
      .map((l) => ({ value: l, status: "invalidated" } as ILetter));
    currGuessArray.forEach((l, i) => {
      if (solArray[i] === l.value) {
        currGuessArray[i].status = "correct";
        solArray[i] = null;
      }
    });

    currGuessArray.forEach((l, i) => {
      if (solArray.includes(l.value) && l.status !== "correct") {
        currGuessArray[i].status = "misplaced";
        solArray[solArray.indexOf(l.value)] = null;
      }
    });

    return currGuessArray;
  };

  const addCurrGuess = () => {
    if (isGameOver()) {
      return;
    }
    setGuesses((prev) => [...prev, validateCurrGuess()]);
    setTurn((prev) => prev + 1);
    setCurrentGuess("");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentGuess.length === 5 || currentGuess.length < 5) {
        return;
      } else {
        addCurrGuess();
      }
    } else if (e.key === "Backspace") {
      setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
      return;
    } else if (/^[A-Za-z]$/.test(e.key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + e.key.toUpperCase());
      }
    }
  };

  const handleButtonPress = () => {};
  return {
    turn,
    currentGuess,
    guesses,
    handleKeyPress,
    handleButtonPress,
    attempts,
  };
};
