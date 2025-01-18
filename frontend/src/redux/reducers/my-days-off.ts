import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { DaysOffFilter, DaysOffUser } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  myDaysOff: DaysOffUser[];
} = {
  loading: false,
  myDaysOff: [],
};

export const getMyDaysOff = createAsyncThunk(
  "days-off/me",
  async (searchParams: DaysOffFilter, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.MY_DAYS_OFF, {
        params: {
          type: searchParams?.type,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const daysOffSlice = createSlice({
  name: "me/days-off",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMyDaysOff.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMyDaysOff.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.myDaysOff = payload;
    });
    builder.addCase(getMyDaysOff.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default daysOffSlice.reducer;
