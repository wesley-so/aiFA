import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { useHref } from "react-router-dom";

const NavigationBar: FC<{}> = () => {
  const loginUri = useHref("login");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            aiFA
          </Typography>
          <Button color="inherit" href={loginUri}>
            Login / Register
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
