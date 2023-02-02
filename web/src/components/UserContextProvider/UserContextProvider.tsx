import { FC, ReactNode, useCallback } from "react";
import { useSetState } from "react-use";
import UserContext from "../../context/UserContext";
import LoginStatus from "../../models/LoginStatus";

export const UserContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [loginStatus, setLoginStatus] = useSetState<LoginStatus>({
    isLoginPending: false,
    isLoggedIn: false,
  });

  const fetchLogin = useCallback(
    (username: string, password: string): void => {
      setLoginStatus({ isLoginPending: true, isLoggedIn: false });

      // TODO: Write login function with API calls.

      setLoginStatus({
        isLoginPending: false,
        isLoggedIn: false,
        loginError: new Error("Login not implemented."),
      });
    },
    [setLoginStatus]
  );

  const fetchLogout = useCallback(() => {
    // TODO: Write logout function with API calls.

    setLoginStatus({
      isLoginPending: false,
      isLoggedIn: false,
      loginError: new Error("Logout not implemented. Forced logout."),
    });
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
