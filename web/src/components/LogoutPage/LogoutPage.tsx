import { Grid, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { removeSessionToken } from "../../services/session";
import DashboardNavigationBar from "../DashboardNavigationBar/DashboardNavigationBar";

const LogoutPage: FC = () => {
  const { fetchLogout } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      await fetchLogout();
      removeSessionToken();
      navigate("/login");
    };
    logout();
  }, [fetchLogout, navigate]);
  return (
    <>
      <DashboardNavigationBar />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="15vh"
      >
        <Typography variant="h5">Logout</Typography>
        <Typography variant="body1">
          You will be redirected to Home Page in 3 seconds.
        </Typography>
      </Grid>
    </>
  );
};

export default LogoutPage;
