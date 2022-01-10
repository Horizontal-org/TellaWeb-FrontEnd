import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const ISSERVER = typeof window === "undefined";
interface AuthState {
  accessToken?: string;
  errorMessage?: string;
}

const initialState: AuthState = {
  accessToken: !ISSERVER ? localStorage.getItem("access_token") : undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      _,
      { payload: { access_token } }: PayloadAction<{ access_token: string }>
    ) => {
      return {
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
        accessToken: undefined,
      };
    },
  },
  extraReducers: {},
});

export const { setCredentials, setError, clearCredentials } = authSlice.actions;
