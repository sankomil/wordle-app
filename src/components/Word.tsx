import React from "react";
import "./components.css";
import { Letter } from "./Letter";
import { ILetter } from "../types";

export const Word = ({ word }: { word: ILetter[] }) => {
  return (
    <div className="word">
      {word.map((letter) => (
        <Letter value={letter.value} status={letter.status} />
      ))}
    </div>
  );
};
