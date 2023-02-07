import { Person } from "@mui/icons-material";
import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material";
import { FC } from "react";
import { useHref } from "react-router-dom";

const HomeNavigationBar: FC = () => {
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

export default HomeNavigationBar;
