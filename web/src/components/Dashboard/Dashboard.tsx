import { Box, Grid, Typography } from "@mui/material";
import { FC } from "react";
import DashboardNavigationBar from "../DashboardNavigationBar/DashboardNavigationBar";

const Dashboard: FC = () => {
  return (
    <>
      <DashboardNavigationBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="left"
          justifyContent="left"
          marginLeft="15px"
        >
          <Typography variant="h3">Dashboard</Typography>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
