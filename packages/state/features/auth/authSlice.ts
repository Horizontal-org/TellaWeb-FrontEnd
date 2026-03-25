import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const ISSERVER = typeof window === "undefined";
interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  errorMessage?: string;
}

const initialState: AuthState = {
  accessToken: !ISSERVER ? localStorage.getItem("access_token") : undefined,
  refreshToken: !ISSERVER ? localStorage.getItem("refresh_token") : undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      _,
      { payload: { access_token, refresh_token } }: PayloadAction<{ access_token: string; refresh_token?: string }>
    ) => {
      localStorage.setItem("access_token", access_token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }

      if (process.env.NODE_ENV === 'development') {
        Cookies.set("access_token", access_token);
      }
      
      return {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    },
    setError: (_, { payload }: PayloadAction<string>) => {
      return {
        errorMessage: payload,
      };
    },
    clearCredentials: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      Cookies.remove("access_token");
      return {
        accessToken: undefined,
        refreshToken: undefined,
      };
    },
  },
  extraReducers: {},
});

export const { setCredentials, setError, clearCredentials } = authSlice.actions;
