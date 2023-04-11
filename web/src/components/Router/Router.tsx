import { FC, useCallback } from "react";
import {
  BrowserRouter,
  Navigate,
  redirect,
  Route,
  Routes,
} from "react-router-dom";
import useUser from "../../hooks/useUser";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import HomePage from "../HomePage/HomePage";
import LoginPage from "../LoginPage/LoginPage";
import LogoutPage from "../LogoutPage/LogoutPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import ProfilePage from "../ProfilePage/ProfilePage";
import RequireLoginRoute from "./RequireLoginRoute";
import StockQuotePage from "../StockQuotePage/StockQuotePage";
import InvestmentPage from "../InvestmentPage/InvestmentPage";

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
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/quote" />}
          />
          <Route path="/dashboard/quote" element={<StockQuotePage />} />
          <Route path="/dashboard/investment" element={<InvestmentPage />} />
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
