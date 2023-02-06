import { FC, Fragment, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useUser from "../../hooks/useUser";

interface RequireLoginRouteProps {
  children?: ReactNode;
  require: "loggedIn" | "loggedOut";
}

const RequireLoginRoute: FC<RequireLoginRouteProps> = ({
  children,
  require,
}) => {
  const {
    loginStatus: { isLoggedIn },
  } = useUser();

  const redirect = require === "loggedIn" ? "/login" : "/dashboard";

  return isLoggedIn === (require === "loggedIn") ? (
    <Fragment>{children}</Fragment>
  ) : (
    <Navigate replace to={redirect} />
  );
};

export default RequireLoginRoute;
