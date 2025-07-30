import React from "react";
import { IGameBoard, ILetter } from "../types";
import { Word } from "./Word";
import "./components.css";

export const GameBoard = ({
  attempts,
  turn,
  guesses,
  currentGuess,
}: IGameBoard) => {
  const rows = new Array(attempts).fill("");

  const currGuessRow = new Array(5).fill("").map((_, i) => {
    if (i < currentGuess.length) {
      return { value: currentGuess[i], status: "invalidated" } as ILetter;
    } else {
      return { value: "", status: "invalidated" } as ILetter;
    }
  });

  return (
    <div className="game-board">
      {rows.map((_, i) => {
        if (i < turn) {
          return <Word word={guesses[i]} />;
        } else if (i === turn) {
          return <Word key={`${i}`} word={currGuessRow} isCurrentGuess />;
        } else {
          return (
            <Word
              key={`${i}`}
              word={new Array(5).fill({ value: "", status: "invalidated" })}
            />
          );
        }
      })}
    </div>
  );
};
