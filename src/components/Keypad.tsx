import React from "react";
import "./components.css";

export const Keypad = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  return (
    <div className="keypad">
      {alphabet.map((letter) => (
        <div className="key" key="letter">
          {letter}
        </div>
      ))}
    </div>
  );
};
