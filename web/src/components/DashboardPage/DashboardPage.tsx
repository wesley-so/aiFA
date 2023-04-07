import { Grid, Typography } from "@mui/material";
import { FC } from "react";

const DashboardPage: FC = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="left"
      justifyContent="left"
      padding="15px"
    >
      <Typography variant="h3">Dashboard</Typography>
    </Grid>
  );
};

export default DashboardPage;
