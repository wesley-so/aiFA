import { FC } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "../App/App";
import HomePage from "../HomePage/HomePage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import UserProfilePage from "../UserProfilePage/UserProfilePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="app" element={<App />}></Route>
      <Route path="login" element={<LoginPage />}></Route>
      <Route path="register" element={<RegisterPage />}></Route>
      <Route path="profile" element={<UserProfilePage />}></Route>
    </>
  )
);

const Router: FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
