import { Grid, Typography } from "@mui/material";
import { FC } from "react";
// import { useNavigate } from "react-router-dom";
import DashboardNavigationBar from "../DashboardNavigationBar/DashboardNavigationBar";

// async function handleLogout() {
//     const nav = useNavigate();
//     nav("/")
// }

const LogoutPage: FC = () => {
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
