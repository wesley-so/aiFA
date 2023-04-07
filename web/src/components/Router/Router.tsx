import { FC, useCallback } from "react";
import { BrowserRouter, redirect, Route, Routes } from "react-router-dom";
import useUser from "../../hooks/useUser";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import HomePage from "../HomePage/HomePage";
import LoginPage from "../LoginPage/LoginPage";
import LogoutPage from "../LogoutPage/LogoutPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import ProfilePage from "../ProfilePage/ProfilePage";
import RequireLoginRoute from "./RequireLoginRoute";
import DashboardPage from "../DashboardPage/DashboardPage";

const Router: FC = () => {
  const {
    fetchLogout,
    loginStatus: { isLoggedIn },
  } = useUser();

  const redirectLoggeedInUser = useCallback(() => {
    if (isLoggedIn) {
      redirect("/dashboard");
    }
  }, [isLoggedIn]);

  const logout = useCallback(async () => {
    await fetchLogout();
    throw redirect("/");
  }, [fetchLogout]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <RequireLoginRoute require="loggedIn">
              <DashboardLayout />
            </RequireLoginRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route
          path="/login"
          loader={redirectLoggeedInUser}
          element={
            <RequireLoginRoute require="loggedOut">
              <LoginPage />
            </RequireLoginRoute>
          }
        />
        <Route path="/logout" loader={logout} element={<LogoutPage />} />
        <Route
          path="/register"
          loader={redirectLoggeedInUser}
          element={
            <RequireLoginRoute require="loggedOut">
              <RegisterPage />
            </RequireLoginRoute>
          }
        />
        <Route
          path="/user"
          element={
            <RequireLoginRoute require="loggedIn">
              <DashboardLayout />
            </RequireLoginRoute>
          }
        >
          <Route path="/user/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
