import Cookies from "js-cookie";

export const getSessionToken = () => {
  return Cookies.get("session");
};

export const setSessionToken = (token: string) => {
  return Cookies.set("session", token, { path: "/" });
};

export const removeSessionToken = () => {
  return Cookies.set("session", "", { path: "/" });
};
