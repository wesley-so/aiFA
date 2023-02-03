import { Grid, Typography } from "@mui/material";
import { FC } from "react";
import UserNavigationBar from "../UserNavigationBar/UserNavigationBar";

const HomePage: FC = () => {
  return (
    <>
      <UserNavigationBar />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h1">aiFA</Typography>
        <Typography variant="body1">This is the description</Typography>
      </Grid>
    </>
  );
};

export default HomePage;
