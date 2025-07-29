import React from "react";
import "./components.css";
import { ILetter } from "../types";

export const Letter = ({ value, status }: ILetter) => {
  return (
    <div className={`letter letter-status-${status}`}>
      {value.toUpperCase()}
    </div>
  );
};
