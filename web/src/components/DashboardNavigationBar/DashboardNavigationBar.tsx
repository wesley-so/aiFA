import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { Link, useHref } from "react-router-dom";

const DashboardNavigationBar: FC = () => {
  const dashboardUri = useHref("/");
  const logoutUri = useHref("/logout");
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="absolute">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to={dashboardUri}
                style={{ textDecoration: "none", color: "#FFF" }}
              >
                aiFA
              </Link>
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography variant="h6">{}</Typography>
              <Button variant="outlined" color="inherit" href={logoutUri}>
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default DashboardNavigationBar;
