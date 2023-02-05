import axios, { AxiosError } from "axios";
import { FC, ReactNode, useCallback } from "react";
import { redirect } from "react-router-dom";
import { useSetState } from "react-use";
import config from "../../config";
import UserContext from "../../context/UserContext";
import LoginStatus from "../../models/LoginStatus";

export const UserContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [loginStatus, setLoginStatus] = useSetState<LoginStatus>({
    isLoginPending: false,
    isLoggedIn: false,
    loginError: null,
  });

  const fetchLogin = useCallback(
    (username: string, password: string): void => {
      setLoginStatus({
        isLoginPending: true,
        isLoggedIn: false,
        loginError: undefined,
      });

      axios
        .post<{ token: string }>(
          `${config.apiUrl}/user/login`,
          { username, password },
          { headers: { "Content-Type": "application/json" } }
        )
        .then(
          (response) => {
            const { token } = response.data;
            console.debug(`Login successfully! Token: ${token}`);
            setLoginStatus({
              isLoginPending: false,
              isLoggedIn: true,
              loginError: undefined,
            });
          },
          (error: AxiosError) => {
            const errorMsg =
              error.response?.status === 400
                ? "Username or password incorrect! Please try again."
                : "Currently unable to login due to unknown error.";
            setLoginStatus({
              isLoginPending: false,
              isLoggedIn: false,
              loginError: new Error(errorMsg),
            });
          }
        );
    },
    [setLoginStatus]
  );

  const fetchLogout = useCallback((): void => {
    setLoginStatus({
      isLoginPending: false,
      isLoggedIn: true,
      loginError: undefined,
    });
    axios
      .post(
        `${config.apiUrl}/user/logout`,
        {},
        { headers: { "Content-Type": "application/json" } }
      )
      .then(
        () => {
          redirect("/");
          setLoginStatus({
            isLoginPending: false,
            isLoggedIn: false,
            loginError: undefined,
          });
        },
        (error: AxiosError) => {
          const errorMsg =
            error.response?.status === 400
              ? "Logout unsuccessful. Please try again!"
              : "Currently unable to logout due to unknown error.";
          setLoginStatus({
            isLoginPending: false,
            isLoggedIn: false,
            loginError: new Error(errorMsg),
          });
        }
      );
  }, [setLoginStatus]);

  return (
    <UserContext.Provider
      value={{
        loginStatus,
        fetchLogin,
        fetchLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
