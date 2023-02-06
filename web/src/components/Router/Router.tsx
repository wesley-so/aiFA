import { FC, useCallback } from "react";
import { BrowserRouter, redirect, Route, Routes } from "react-router-dom";
import useUser from "../../hooks/useUser";
import Dashboard from "../Dashboard/Dashboard";
import HomePage from "../HomePage/HomePage";
import LoginPage from "../LoginPage/LoginPage";
import LogoutPage from "../LogoutPage/LogoutPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import UserProfilePage from "../UserProfilePage/UserProfilePage";
import RequireLoginRoute from "./RequireLoginRoute";

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
          path="dashboard"
          element={
            <RequireLoginRoute require="loggedIn">
              <Dashboard />
            </RequireLoginRoute>
          }
        />
        <Route
          path="login"
          loader={redirectLoggeedInUser}
          element={
            <RequireLoginRoute require="loggedOut">
              <LoginPage />
            </RequireLoginRoute>
          }
        />
        <Route path="logout" loader={logout} element={<LogoutPage />}></Route>
        <Route
          path="profile"
          element={
            <RequireLoginRoute require="loggedIn">
              <UserProfilePage />
            </RequireLoginRoute>
          }
        />
        <Route
          path="register"
          loader={redirectLoggeedInUser}
          element={
            <RequireLoginRoute require="loggedOut">
              <RegisterPage />
            </RequireLoginRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
