import { Grid, Typography } from "@mui/material";
import { FC } from "react";
import DashboardNavigationBar from "../DashboardNavigationBar/DashboardNavigationBar";

const Dashboard: FC = () => {
  return (
    <>
      <DashboardNavigationBar />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="left"
        justifyContent="left"
        marginLeft="15px"
        paddingTop="5vh"
      >
        <Typography
          variant="h3"
          component="h1"
        >
          Dashboard
        </Typography>
      </Grid>
    </>
  );
};

export default Dashboard;
