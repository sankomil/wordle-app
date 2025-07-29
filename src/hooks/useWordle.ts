import { useState } from "react";
import { ILetter } from "../types";

export const useWordle = () => {
  const attempts = parseInt(process.env.REACT_APP_ATTEMPTS || "5");
  const wordList = JSON.parse(process.env.REACT_APP_WORDLE_LIST || "[]");

  const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

  const [gameBoard, setGameBoard] = useState<ILetter[][]>(
    new Array(attempts).fill(
      new Array(5).fill({
        value: "",
        status: "invalidated",
      })
    )
  );

  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const handleKeyPress = () => {};

  const handleButtonPress = () => {};
  return {
    turn,
    currentGuess,
    gameBoard,
    handleKeyPress,
    handleButtonPress,
    attempts,
  };
};
