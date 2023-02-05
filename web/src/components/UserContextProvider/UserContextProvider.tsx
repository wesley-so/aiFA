import axios, { AxiosError } from "axios";
import { FC, ReactNode, useCallback, useState } from "react";
import { redirect } from "react-router-dom";
import { useSetState } from "react-use";
import config from "../../config";
import UserContext from "../../context/UserContext";
import LoginStatus from "../../models/LoginStatus";
import User from "../../models/User";

export const UserContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();
  const [loginStatus, setLoginStatus] = useSetState<LoginStatus>({
    isLoginPending: false,
    isLoggedIn: false,
    loginError: null,
  });

  const fetchLogin = useCallback(
    async (username: string, password: string): Promise<void> => {
      setLoginStatus({
        isLoginPending: true,
        isLoggedIn: false,
        loginError: null,
      });

      try {
        const loginResponse = await axios.post<{ token: string }>(
          `${config.apiUrl}/user/login`,
          { username, password },
          { headers: { "Content-Type": "application/json" } }
        );

        const userResponse = await axios.get<User>(`${config.apiUrl}/user/me`, {
          headers: { Authorization: `Bearer ${loginResponse.data.token}` },
        });

        setUser(userResponse.data);

        setLoginStatus({ isLoginPending: false, isLoggedIn: true });

        console.debug(`Login successfully! Token: ${loginResponse.data.token}`);
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

  const fetchLogout = useCallback((): void => {
    setLoginStatus({
      isLoginPending: false,
      isLoggedIn: true,
      loginError: null,
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
            loginError: null,
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
