import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { endpoints } from "../../shared/constants";
import { User } from "../../shared/interfaces";

const initialState: {
  loadingList: boolean;
  users: User[];
  errorLodaingList: string;
  loadingSelectedUser: boolean;
  selectedUser: User;
  errorLodaingSelectedUser: string;
} = {
  loadingList: false,
  users: [],
  errorLodaingList: "",
  loadingSelectedUser: false,
  selectedUser: null,
  errorLodaingSelectedUser: "",
};

export const getUsers = createAsyncThunk(
  "users",
  async (object, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.USERS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "users/details",
  async ({ userId }: { userId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.USER_DETAILS, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async ({ userId }: { userId: number }, { rejectWithValue, dispatch }) => {
    try {
      await axios.post(endpoints.DELETE_USER, JSON.stringify({ userId }));
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

    dispatch(getUsers());
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.loadingList = true;
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.loadingList = false;
      state.users = payload;
    });
    builder.addCase(getUsers.rejected, (state, { payload }) => {
      state.loadingList = false;
      state.errorLodaingList = payload?.["message"];
    });
    builder.addCase(getUserDetails.pending, (state) => {
      state.loadingSelectedUser = true;
    });
    builder.addCase(getUserDetails.fulfilled, (state, { payload }) => {
      state.loadingSelectedUser = false;
      state.selectedUser = payload;
    });
    builder.addCase(getUserDetails.rejected, (state, { payload }) => {
      state.loadingSelectedUser = false;
      state.errorLodaingSelectedUser = payload?.["message"];
    });
  },
});

export default usersSlice.reducer;
