import { FC, useCallback } from "react";
import { BrowserRouter, redirect, Route, Routes } from "react-router-dom";
import useUser from "../../hooks/useUser";
import App from "../App/App";
import Dashboard from "../Dashboard/Dashboard";
import HomePage from "../HomePage/HomePage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import UserProfilePage from "../UserProfilePage/UserProfilePage";

const Router: FC = () => {
  const {
    loginStatus: { isLoggedIn },
  } = useUser();

  const redirectLoggeedInUser = useCallback(() => {
    if (isLoggedIn) {
      redirect("/dashboard");
    }
  }, [isLoggedIn]);

  const requireLogin = useCallback(() => {
    if (!isLoggedIn) {
      redirect("/login");
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="app" element={<App />}></Route>
        <Route
          path="dashboard"
          loader={requireLogin}
          element={<Dashboard />}
        ></Route>
        <Route
          path="login"
          loader={redirectLoggeedInUser}
          element={<LoginPage />}
        ></Route>
        <Route path="register" element={<RegisterPage />}></Route>
        <Route
          path="profile"
          loader={requireLogin}
          element={<UserProfilePage />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
