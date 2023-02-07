import { Box, Grid, Typography } from "@mui/material";
import { FC } from "react";
import HomeNavigationBar from "./HomeNavigationBar";
import "./HomePage.css";
import backgroundImage from "./background.webp";
import { grey } from "@mui/material/colors";

const HomePage: FC = () => {
  return (
    <Box
      color={grey[300]}
      height="100vh"
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <HomeNavigationBar />
      <Grid
        alignItems="center"
        color={grey[400]}
        container
        direction="column"
        height="100vh"
        justifyContent="center"
        spacing={0}
        sx={{
          backdropFilter: "blur(2px)",
        }}
      >
        <Typography variant="h1">aiFA</Typography>
        <Typography variant="body1">
          Your intelligent finicial advisor
        </Typography>
      </Grid>
    </Box>
  );
};

export default HomePage;
