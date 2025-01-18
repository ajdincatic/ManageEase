import { Navigate, Route, Routes } from "react-router";

import { routes } from "../../shared/constants";
import { UserType } from "../../shared/enums";
import { CreateDayOff } from "../owner/create-day-off";
import { DaysOff } from "../owner/days-off";
import { HomePageOwner } from "../owner/home-page-owner";
import { Iterations } from "../owner/iterations";
import { Requests } from "../owner/requests";
import { UserDetailsModal } from "../owner/user-details";
import { Users } from "../owner/users";
import { CreateNewRequest } from "../user/create-new-request";
import { HomePageUser } from "../user/home-page-user";
import { MyDaysOff } from "../user/my-days-off";
import { MyRequests } from "../user/my-requests";
import { ChangePassword } from "./change-password";
import { Holidays } from "./holidays";
import { Login } from "./login";

export const RoutesWrapper = ({ isLoggedIn, type }) => (
  <Routes>
    {!isLoggedIn ? (
      <>
        <Route index path={routes.LOGIN} element={<Login />}></Route>
      </>
    ) : (
      <>
        {type === UserType.USER ? (
          <>
            <Route index path={routes.HOME} element={<HomePageUser />}></Route>
            <Route path={routes.MY_REQUESTS} element={<MyRequests />}></Route>
            <Route path={routes.MY_DAYS_OFF} element={<MyDaysOff />}></Route>
            <Route
              path={routes.CREATE_NEW_REQUEST}
              element={<CreateNewRequest />}
            ></Route>
          </>
        ) : (
          <>
            <Route index path={routes.HOME} element={<HomePageOwner />}></Route>
            <Route path={routes.USERS} element={<Users />}></Route>
            <Route
              path={`${routes.USERS}/:userId`}
              element={<UserDetailsModal />}
            ></Route>

            <Route path={routes.REQUESTS} element={<Requests />}></Route>
            <Route path={routes.DAYS_OFF} element={<DaysOff />}></Route>
            <Route path={routes.ITERATIONS} element={<Iterations />}></Route>
            <Route
              path={routes.CREATE_DAY_OFF}
              element={<CreateDayOff />}
            ></Route>
          </>
        )}
        <Route
          path={routes.CHANGE_PASSWORD}
          element={<ChangePassword />}
        ></Route>
        <Route path={routes.HOLIDAYS} element={<Holidays />}></Route>
      </>
    )}

    <Route path="*" element={<Navigate to={"/"} />}></Route>
  </Routes>
);
