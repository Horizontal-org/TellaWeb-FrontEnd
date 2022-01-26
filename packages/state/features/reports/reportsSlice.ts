import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Report } from "../../domain/report";

interface ReportState {
  currentReport?: Report;
}

const initialState: ReportState = {};

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setCurrentReport: (
      state,
      { payload: currentReport }: PayloadAction<Report>
    ) => {
      return {
        ...state,
        currentReport,
      };
    },
  },
  extraReducers: {},
});

export const { setCurrentReport } = reportsSlice.actions;
