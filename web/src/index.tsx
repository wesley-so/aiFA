import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./components/Router/Router";
import { UserContextProvider } from "./components/UserContextProvider/UserContextProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <Router />
    </UserContextProvider>
  </React.StrictMode>
);
