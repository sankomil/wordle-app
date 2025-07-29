import { useState } from "react";
import { ILetter } from "../types";

export const useWordle = () => {
  const attempts = parseInt(process.env.REACT_APP_ATTEMPTS || "5");
  const wordList = JSON.parse(process.env.REACT_APP_WORDLE_LIST || "[]");

  const selectedWord =
    wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();

  const [guesses, setGuesses] = useState<ILetter[][]>([]);

  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const validateCurrGuess = () => {
    const solArray: (string | null)[] = selectedWord.split("");
    const currGuessArray: ILetter[] = currentGuess
      .split("")
      .map((l) => ({ value: l, status: "invalidated" }));

    // Find correct letters (green)
    const guessWithCorrect: ILetter[] = currGuessArray.map((letterObj, i) => {
      if (solArray[i] === letterObj.value) {
        solArray[i] = null; // remove from pool
        return { ...letterObj, status: "correct" };
      }
      return letterObj;
    });

    // Find misplaced letters (yellow)
    const finalValidatedGuess: ILetter[] = guessWithCorrect.map((letterObj) => {
      if (letterObj.status === "correct") {
        return letterObj;
      }

      const letterIndex = solArray.indexOf(letterObj.value);

      if (letterIndex > -1) {
        solArray[letterIndex] = null; // remove from pool
        return { ...letterObj, status: "misplaced" };
      }

      return { ...letterObj, status: "incorrect" };
    });

    return finalValidatedGuess;
  };

  const addCurrGuess = () => {
    if (turn + 1 === attempts || currentGuess === selectedWord) {
      return;
    }
    const currValidation = validateCurrGuess();
    setGuesses((prev) => [...prev, currValidation]);
    setTurn((prev) => prev + 1);
    setCurrentGuess("");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentGuess.length !== 5) {
        return;
      } else {
        addCurrGuess();
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
      return;
    } else if (/^[A-Za-z]$/.test(e.key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + e.key.toUpperCase());
      }
    }
  };

  const handleButtonPress = (letter: string) => {
    console.log("key press", letter);
    if (letter === "Enter") {
      if (currentGuess.length > 5 || currentGuess.length < 5) {
        return;
      } else {
        addCurrGuess();
      }
    } else if (letter === "Delete") {
      setCurrentGuess((prevGuess) => prevGuess.slice(0, -1));
      return;
    } else if (/^[A-Za-z]$/.test(letter)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + letter.toUpperCase());
      }
    }
  };
  return {
    turn,
    currentGuess,
    guesses,
    handleKeyPress,
    handleButtonPress,
    attempts,
  };
};
