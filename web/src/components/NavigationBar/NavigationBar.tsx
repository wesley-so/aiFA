import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { Link, useHref } from "react-router-dom";

const NavigationBar: FC = () => {
  const homeUri = useHref("/");
  const loginUri = useHref("/login");
  const registerUri = useHref("/register");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to={homeUri}>aiFA</Link>
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" color="inherit" href={loginUri}>
              Login
            </Button>
            <Button variant="outlined" color="inherit" href={registerUri}>
              Register
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
