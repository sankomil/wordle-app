export interface ILetter {
  value: string;
  status: "correct" | "misplaced" | "incorrect" | "invalidated";
}

export interface IGameBoard {
  attempts: number;
  turn: number;
  guesses: ILetter[][];
  currentGuess: string;
}
