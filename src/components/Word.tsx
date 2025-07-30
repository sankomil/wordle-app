import React from "react";
import "./components.css";
import { Letter } from "./Letter";
import { ILetter } from "../types";

export const Word = ({
  word,
  isCurrentGuess,
}: {
  word: ILetter[];
  isCurrentGuess?: boolean;
}) => {
  return (
    <div className="word" id={isCurrentGuess ? "current" : ""}>
      {word.map((letter, i) => (
        <Letter
          key={letter.value + i}
          value={letter.value}
          status={letter.status}
        />
      ))}
    </div>
  );
};
