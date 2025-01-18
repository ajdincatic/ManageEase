import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { RequestHandleType } from "../../shared/enums";
import { DayOffRequestByUser } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  requests: DayOffRequestByUser[];
} = {
  loading: false,
  requests: [],
};

export const getRequests = createAsyncThunk(
  "days-off/reqests",
  async (object, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.REQUESTS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const handleRequest = createAsyncThunk(
  "days-off/handle-request",
  async (
    { requestId, type }: { requestId: number; type: RequestHandleType },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await axios.post(
        type === RequestHandleType.APPROVE
          ? endpoints.APPROVE_REQUEST
          : endpoints.DECLINE_REQUEST,
        JSON.stringify({ requestId })
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

    dispatch(getRequests());
  }
);

export const requestsSlice = createSlice({
  name: "days-off/reqests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRequests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRequests.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.requests = payload;
    });
    builder.addCase(getRequests.rejected, (state, { payload }) => {
      state.loading = false;
    });
  },
});

export default requestsSlice.reducer;
