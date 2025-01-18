import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { Iterations } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  iterations: Iterations[];
  activeIteration: Iterations;
} = {
  loading: false,
  iterations: [],
  activeIteration: null,
};

export const getActiveIteration = createAsyncThunk(
  "iterations/active",
  async (object, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.GET_ACTIVE_ITERATION);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getIterationsList = createAsyncThunk(
  "iterations",
  async (object, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.ITERATIONS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const activateIteration = createAsyncThunk(
  "iterations/activate",
  async (
    { iterationId }: { iterationId: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await axios.put(
        endpoints.ACTIVATE_ITERATION,
        JSON.stringify({ iterationId })
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

    dispatch(getIterationsList());
  }
);

export const deleteIteration = createAsyncThunk(
  "iterations/delete",
  async (
    { iterationId }: { iterationId: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await axios.post(
        endpoints.DELETE_ITERATION,
        JSON.stringify({ iterationId })
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

    dispatch(getIterationsList());
  }
);

export const iterationsSlice = createSlice({
  name: "iterations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIterationsList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getIterationsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.iterations = payload;
    });
    builder.addCase(getIterationsList.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(getActiveIteration.fulfilled, (state, { payload }) => {
      state.activeIteration = payload;
    });
  },
});

export default iterationsSlice.reducer;
