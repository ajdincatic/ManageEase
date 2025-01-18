import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/auth";
import daysOffReducer from "./reducers/days-off";
import holidaysReducer from "./reducers/holidays";
import iterationsReducer from "./reducers/iterations";
import meReducer from "./reducers/me";
import myDaysOffReducer from "./reducers/my-days-off";
import myRequestsReducer from "./reducers/my-requests";
import requestsReducer from "./reducers/requests";
import usersReducer from "./reducers/users";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers = combineReducers({
  me: meReducer,
  myRequests: myRequestsReducer,
  requests: requestsReducer,
  myDaysOff: myDaysOffReducer,
  daysOff: daysOffReducer,
  holidays: holidaysReducer,
  users: usersReducer,
  iterations: iterationsReducer,
  auth: persistReducer(persistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducers,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
