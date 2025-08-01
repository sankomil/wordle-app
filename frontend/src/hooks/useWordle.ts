import { useState } from "react";
import { ILetter, TLetterStatus } from "../types";
import { validateInput, getSession } from "../helpers";

export const useWordle = () => {
  const attempts = parseInt(process.env.REACT_APP_ATTEMPTS || "5");

  const [guesses, setGuesses] = useState<ILetter[][]>([]);
  const [solution, setSolution] = useState<string>("");
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [previousLetters, setPreviousLetters] = useState<{
    [key: string]: TLetterStatus;
  }>({});
  const [error, setError] = useState<string>("");

  const [gameOver, setGameOver] = useState({ isOver: false, isVictory: false });

  const fetchSession = async () => {
    const { res, err } = await getSession();

    if (err) {
      if (err.response) {
        setError(err.response.data as string);
      } else {
        setError(err.message);
      }
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (res.guesses.length === 0) {
      return;
    }

    setTurn(res.guesses.length);

    setGuesses(res.guesses);

    if (res.solution) {
      setSolution(res.solution);
      const lastGuess = res.guesses[res.guesses.length - 1]
        .reduce((partial, l) => partial + l.value, "")
        .trim()
        .toUpperCase();
      setGameOver({
        isOver: true,
        isVictory: lastGuess === solution && res.guesses.length <= attempts,
      });
    }

    setPreviousLetters(() => {
      const newPreviousLetters: { [key: string]: TLetterStatus } = {};

      res.guesses.forEach((word) => {
        word.forEach(({ status, value }) => {
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
      });
      return newPreviousLetters;
    });
  };

  const addCurrGuess = async () => {
    const { res, err } = await validateInput({
      guess: currentGuess,
      turn: turn,
    });

    if (err) {
      if (err.response) {
        setError(err.response.data as string);
      } else {
        setError(err.message);
      }
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (turn + 1 === attempts || currentGuess === res.solution) {
      setGameOver({
        isOver: true,
        isVictory: currentGuess === res.solution && turn + 1 <= attempts,
      });
    }

    const currValidation = res.validated_guess;

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
    setSolution(res.solution);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (gameOver.isOver) {
      return;
    }
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
    if (gameOver.isOver) {
      return;
    }
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
    solution,
    fetchSession,
    error,
  };
};
