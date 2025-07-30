import { useState } from "react";
import { ILetter, TLetterStatus } from "../types";

export const useWordle = (selectedWord: string) => {
  const attempts = parseInt(process.env.REACT_APP_ATTEMPTS || "5");
  const wordList = JSON.parse(process.env.REACT_APP_WORDLE_LIST || "[]");

  const [guesses, setGuesses] = useState<ILetter[][]>([]);

  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [previousLetters, setPreviousLetters] = useState<{
    [key: string]: TLetterStatus;
  }>({});

  console.log("test", selectedWord);

  const [gameOver, setGameOver] = useState({ isOver: false, isVictory: false });

  const validateCurrGuess = () => {
    const solArray: (string | null)[] = selectedWord.split("");
    const currGuessArray: ILetter[] = currentGuess
      .split("")
      .map((l) => ({ value: l, status: "invalidated" }));

    const guessWithCorrect: ILetter[] = currGuessArray.map((letterObj, i) => {
      if (solArray[i] === letterObj.value) {
        solArray[i] = null;
        return { ...letterObj, status: "correct" };
      }
      return letterObj;
    });

    const finalValidatedGuess: ILetter[] = guessWithCorrect.map((letterObj) => {
      if (letterObj.status === "correct") {
        return letterObj;
      }

      const letterIndex = solArray.indexOf(letterObj.value);

      if (letterIndex > -1) {
        solArray[letterIndex] = null;
        return { ...letterObj, status: "misplaced" };
      }

      return { ...letterObj, status: "incorrect" };
    });

    return finalValidatedGuess;
  };

  const addCurrGuess = () => {
    if (turn + 1 === attempts || currentGuess === selectedWord) {
      setGameOver({
        isOver: true,
        isVictory: currentGuess === selectedWord && turn + 1 < attempts,
      });
    }
    const currValidation = validateCurrGuess();
    setGuesses((prev) => [...prev, currValidation]);
    setPreviousLetters((prev) => {
      const newPreviousLetters = { ...prev };
      currValidation.forEach(({ status, value }) => {
        const existingStatus = newPreviousLetters[value];
        if (existingStatus === "correct") {
          return;
        }
        if (existingStatus === "misplaced" && status !== "correct") {
          return;
        }
        if (
          existingStatus === "incorrect" &&
          status !== "correct" &&
          status !== "misplaced"
        ) {
          return;
        }
        newPreviousLetters[value] = status;
      });
      return newPreviousLetters;
    });
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
    previousLetters,
    gameOver,
    selectedWord,
  };
};
