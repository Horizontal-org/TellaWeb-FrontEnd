import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "packages/state/domain/user";

interface UserState {
  user?: User;
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, { payload }: PayloadAction<User>) => ({
      user: payload,
    }),
  },
  extraReducers: {},
});

export const { setUser } = userSlice.actions;
