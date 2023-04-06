import {
  AppBar,
  Box,
  Button,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { FC } from "react";
import "./HomePage.css";
import backgroundImage from "./background.webp";
import { grey } from "@mui/material/colors";
import { Person } from "@mui/icons-material";
import { useHref } from "react-router-dom";

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
      <NavBar />
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
          Your intelligent financial advisor
        </Typography>
      </Grid>
    </Box>
  );
};

const NavBar: FC = () => {
  const loginUri = useHref("/login");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" position="absolute">
        <Toolbar>
          <Box component="div" flexGrow={1} />
          <Stack direction="row" spacing={2}>
            <Button
              color="inherit"
              href={loginUri}
              startIcon={<Person />}
              variant="outlined"
            >
              Account
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HomePage;
