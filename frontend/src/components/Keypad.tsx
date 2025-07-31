import React from "react";
import "./components.css";
import { IKeypad } from "../types";

export const Keypad = ({ handleButtonPress, previousLetters }: IKeypad) => {
  const firstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const secondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const thirdRow = ["Delete", "Z", "X", "C", "V", "B", "N", "M", "Enter"];
  return (
    <div className="keypad">
      <div className="key-row">
        {firstRow.map((item) => (
          <div
            className={`key key-${previousLetters[item]}`}
            onClick={() => handleButtonPress(item)}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="key-row">
        {secondRow.map((item) => (
          <div
            className={`key key-${previousLetters[item]}`}
            onClick={() => handleButtonPress(item)}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="key-row">
        {thirdRow.map((item) => (
          <div
            className={`key key-${previousLetters[item]}`}
            onClick={() => handleButtonPress(item)}
            id={item === "Delete" || item === "Enter" ? "action" : ""}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
