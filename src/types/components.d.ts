export interface ILetter {
  value: string;
  status: "correct" | "misplaced" | "incorrect" | "invalidated";
}
