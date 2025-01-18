import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { DaysOffUser } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  myRequests: DaysOffUser[];
} = {
  loading: false,
  myRequests: [],
};

export const getMyRequests = createAsyncThunk(
  "days-off/me/reqests",
  async (object, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.MY_REQUESTS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const withdrawMyRequests = createAsyncThunk(
  "days-off/me/requsts/withdraw",
  async (
    { requestId }: { requestId: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await axios.post(
        endpoints.WITHDRAW_MY_REQUEST,
        JSON.stringify({ requestId })
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

    dispatch(getMyRequests());
  }
);

export const myRequestsSlice = createSlice({
  name: "days-off/me/reqests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMyRequests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMyRequests.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.myRequests = payload;
    });
    builder.addCase(getMyRequests.rejected, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(withdrawMyRequests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(withdrawMyRequests.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(withdrawMyRequests.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default myRequestsSlice.reducer;
