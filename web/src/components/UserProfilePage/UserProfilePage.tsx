import { Button, Grid, Typography } from "@mui/material";
import { FC } from "react";
import DashboardNavigationBar from "../DashboardNavigationBar/DashboardNavigationBar";

const UserProfilePage: FC = () => {
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
        <Typography variant="h3" component="h1">
          User Profile
        </Typography>
        <Typography variant="h6" placeholder="Username">
          Username:{" "}
        </Typography>
        <Typography variant="h6" placeholder="Email">
          Email:{" "}
        </Typography>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          style={{ width: "200px" }}
        >
          Change profile
        </Button>
      </Grid>
    </>
  );
};

export default UserProfilePage;
