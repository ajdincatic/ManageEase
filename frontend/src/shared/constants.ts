//#region ENDPOINTS

const userEndpoints = {
  MY_REQUESTS: `days-off/me/day-off-requests`,
  MY_DAYS_OFF: `days-off/me/days-off`,
  WITHDRAW_MY_REQUEST: `days-off/me/withdraw-request-for-day-off`,
  CREATE_NEW_REQUEST: `days-off/me/request-day-off`,
};

const ownerEndpoints = {
  CREATE_NEW_HOLIDAY: `days-off/add-holiday`,
  EDIT_HOLIDAY: `days-off/edit-holiday`,
  ACTIVATE_ITERATION: `iterations/activate-iteration`,
  EDIT_ITERATION: `iterations/edit`,
  DELETE_ITERATION: `iterations/delete`,
  USERS: `users/list`,
  REQUESTS: `days-off/day-off-requests`,
  DAYS_OFF: `days-off`,
  APPROVE_REQUEST: `days-off/approve-day-off-request`,
  DECLINE_REQUEST: `days-off/decline-day-off-request`,
  DELETE_HOLIDAY: `days-off/delete-holiday`,
  DELETE_USER: `users/delete`,
  DELETE_DAY_OFF: `days-off/delete-day-off`,
  USER_DETAILS: `users/details`,
  CREATE_NEW_USER: `users/create`,
  EDIT_USER: `users/edit`,
  CREATE_NEW_DAY_OFF: `days-off/create-day-off`,
};

export const endpoints = {
  ...userEndpoints,
  ...ownerEndpoints,
  LOGIN: `users/login`,
  ME: `users/me`,
  CHANGE_PASSWORD: `users/change-password`,
  HOLIDAYS: `days-off/holidays`,
  ITERATIONS: `iterations`,
  GET_ACTIVE_ITERATION: `iterations/active-iteration`,
  CREATE_NEW_ITERATION: `iterations/create`,
};

//#endregion

//#region ROUTES

const userRoutes = {
  MY_REQUESTS: `/me/requests`,
  MY_DAYS_OFF: `/me/days-off`,
  CREATE_NEW_REQUEST: `/me/create-new-request`,
  CHANGE_PASSWORD: `/me/change-password`,
  HOLIDAYS: `/holidays`,
};

const ownerRoutes = {
  USERS: `/users`,
  REQUESTS: "/requests",
  DAYS_OFF: "/days-off",
  CREATE_DAY_OFF: "/create-day-off",
  ITERATIONS: "/iterations",
};

export const routes = {
  LOGIN: `/`,
  HOME: `/`,
  ...userRoutes,
  ...ownerRoutes,
};

//#endregion

export const PASSWORD_RULES =
  "*Password must contain an uppercase letter, a lowercase letter, and a number, with a minimum of 8 characters.";
export const PASSWORD_MATCH_RULES =
  "*New Password and New Password Confirmation fields must match.";
