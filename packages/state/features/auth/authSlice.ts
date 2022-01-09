import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@tellaweb/bloc";

const ISSERVER = typeof window === "undefined";
interface AuthState {
  user?: User;
  accessToken?: string;
  errorMessage?: string;
}

const initialState: AuthState = {
  accessToken: !ISSERVER ? localStorage.getItem("access_token") : undefined,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (
      _,
      {
        payload: { access_token, user },
      }: PayloadAction<{ access_token: string; user: User }>
    ) => {
      return {
        user,
        accessToken: access_token,
      };
    },
    setError: (_, { payload }: PayloadAction<string>) => {
      return {
        errorMessage: payload,
      };
    },
    clearCredentials: () => {
      return {
        user: undefined,
        accessToken: undefined,
      };
    },
  },
  extraReducers: {},
});

export const { setCredentials, setError, clearCredentials } = authSlice.actions;
