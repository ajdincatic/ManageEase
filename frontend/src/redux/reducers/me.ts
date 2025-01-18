import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { User } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  user: User;
} = {
  loading: false,
  user: null,
};

export const getMeUser = createAsyncThunk(
  "auth/me",
  async (object, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.ME);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMeUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMeUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
    });
    builder.addCase(getMeUser.rejected, (state, { payload }) => {
      state.loading = false;
    });
  },
});

export default meSlice.reducer;
