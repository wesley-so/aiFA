import { AxiosError } from "axios";
import { decodeJwt } from "jose";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { useSetState } from "react-use";
import UserContext from "../../context/UserContext";
import LoginStatus from "../../models/LoginStatus";
import User from "../../models/User";
import { getUser, login, logout } from "../../services/aifaAPI/user";
import {
  getSessionToken,
  removeSessionToken,
  setSessionToken,
} from "../../services/session";

export const UserContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [loginStatus, setLoginStatus] = useSetState<LoginStatus>({
    isLoginPending: false,
    isLoggedIn: false,
    loginError: null,
  });

  const fetchLogin = useCallback(
    async (
      username: string,
      password: string,
      existingToken?: string
    ): Promise<void> => {
      setLoginStatus({
        isLoginPending: true,
        isLoggedIn: false,
        loginError: null,
      });

      try {
        const token = existingToken ?? (await login(username, password));
        const user = await getUser(token);

        setSessionToken(token);
        setToken(token);
        setUser(user);
        setLoginStatus({ isLoginPending: false, isLoggedIn: true });
        console.debug(`Login successfully! Token: ${token}`);
      } catch (error) {
        const errorMsg =
          error instanceof AxiosError
            ? error.response?.status === 400
              ? "Username or password incorrect! Please try again."
              : "Currently unable to login due to unknown error."
            : "Unknown error occurred. ";
        const loginError = new Error(errorMsg, { cause: error });
        setLoginStatus({
          isLoginPending: false,
          isLoggedIn: false,
          loginError,
        });
        console.error(loginError);
      }
    },
    [setLoginStatus]
  );

  const fetchLogout = useCallback(async (): Promise<void> => {
    setLoginStatus({
      isLoginPending: false,
      isLoggedIn: true,
      loginError: null,
    });
    try {
      const token = getSessionToken();
      if (token) {
        await logout(token);
      }
    } catch (error) {
      console.error("Logout error", error);
    }
    removeSessionToken();
    setToken(undefined);
    setUser(undefined);
    setLoginStatus({
      isLoginPending: false,
      isLoggedIn: false,
      loginError: null,
    });
  }, [setLoginStatus]);

  useEffect(() => {
    const token = getSessionToken();
    if (token) {
      const payload = decodeJwt(token);
      if (payload.exp && Date.now() / 1000 < payload.exp) {
        fetchLogin("", "", token);
      } else {
        removeSessionToken();
      }
    }
  }, [fetchLogin]);

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        loginStatus,
        fetchLogin,
        fetchLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
