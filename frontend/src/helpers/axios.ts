import axios, { AxiosError, AxiosResponse } from "axios";
import {
  IValidateInputPayload,
  IValidateInputResponse,
  IGetSessionResponse,
} from "../types";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

// Validate the current guess from the user. Accepts the current guess and turn so that server can decide whether solution should be revealed
export const validateInput = async ({
  guess,
  turn,
}: IValidateInputPayload): Promise<IValidateInputResponse> => {
  let res: IValidateInputResponse["res"] = {} as IValidateInputResponse["res"];
  let err: AxiosError | null = null;

  await axiosInstance
    .post(
      "/validate",
      {
        guess,
        turn,
      },
      { withCredentials: true }
    )
    .then((response: AxiosResponse<any, any>) => {
      res = response.data;
    })
    .catch((e: AxiosError) => {
      err = e;
    });

  return { res, err };
};

// Fetch session state. This allows for a game to persist between different browser sessions in the same day
// Note that the cookie sent from the server that is used for server tracking persists only until UTC midnight, after which the game state is reset
export const getSession = async (): Promise<IGetSessionResponse> => {
  let res: IGetSessionResponse["res"] = {} as IGetSessionResponse["res"];
  let err: AxiosError | null = null;

  await axiosInstance
    .get("/get-session", { withCredentials: true })
    .then((response: AxiosResponse<any, any>) => {
      res = response.data;
    })
    .catch((e: AxiosError) => {
      err = e;
    });

  return { res, err };
};
