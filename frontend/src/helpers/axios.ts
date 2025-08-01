import axios, { AxiosError, AxiosResponse } from "axios";
import {
  IValidateInputPayload,
  IValidateInputResponse,
  IGetSessionResponse,
} from "../types";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

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
