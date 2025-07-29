import React from "react";

import { Letter } from "./Letter";
import { ILetter } from "../types";

export const Word = ({ word }: { word: ILetter[] }) => {
  return (
    <div style={{ display: "flex" }}>
      {word.map((letter) => (
        <Letter value={letter.value} status={letter.status} />
      ))}
    </div>
  );
};
