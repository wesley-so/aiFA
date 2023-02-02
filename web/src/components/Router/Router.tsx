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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="app" element={<App />}></Route>
      <Route path="login" element={<LoginPage />}></Route>
    </>
  )
);

const Router: FC<{}> = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default Router;
