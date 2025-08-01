export type TLetterStatus =
  | "correct"
  | "misplaced"
  | "incorrect"
  | "invalidated";

export interface ILetter {
  value: string;
  status: TLetterStatus;
}

export interface IGameBoard {
  attempts: number;
  turn: number;
  guesses: ILetter[][];
  currentGuess: string;
  error: string;
}

export interface IKeypad {
  handleButtonPress: (val: string) => void;
  previousLetters: { [key: string]: TLetterStatus };
}
