import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { Holidays } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  holidays: Holidays[];
} = {
  loading: false,
  holidays: [],
};

export const getHolidaysList = createAsyncThunk(
  "holidays",
  async (object, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.HOLIDAYS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHoliday = createAsyncThunk(
  "holidays/delete",
  async (
    { holidayId }: { holidayId: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await axios.post(endpoints.DELETE_HOLIDAY, JSON.stringify({ holidayId }));
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

    dispatch(getHolidaysList());
  }
);

export const holidaysSlice = createSlice({
  name: "holidays",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHolidaysList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getHolidaysList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.holidays = payload;
    });
    builder.addCase(getHolidaysList.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteHoliday.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteHoliday.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(deleteHoliday.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default holidaysSlice.reducer;
