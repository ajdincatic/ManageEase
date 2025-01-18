import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { DayOffByUser, DaysOffFilter } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  daysOff: DayOffByUser[];
} = {
  loading: false,
  daysOff: [],
};

export const getDaysOff = createAsyncThunk(
  "days-off",
  async (searchParams: DaysOffFilter, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.DAYS_OFF, {
        params: {
          ...searchParams,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDayOff = createAsyncThunk(
  "days-off/delete",
  async ({ requestId }: { requestId: number }, { rejectWithValue }) => {
    try {
      await axios.post(endpoints.DELETE_DAY_OFF, JSON.stringify({ requestId }));
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const daysOffSlice = createSlice({
  name: "days-off",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDaysOff.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDaysOff.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.daysOff = payload;
    });
    builder.addCase(getDaysOff.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default daysOffSlice.reducer;
