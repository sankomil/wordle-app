import { AxiosError } from "axios";
import { ILetter } from "./components";

export interface IValidateInputPayload {
  guess: string;
  turn: number;
}

export interface IValidateInputResponse {
  res: {
    solution: string;
    validated_guess: ILetter[];
  };
  err: AxiosError | null;
}

export interface IGetSessionResponse {
  res: {
    solution: string;
    guesses: ILetter[][];
  }
  err: AxiosError | null;
}