import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import TimelineIcon from "@mui/icons-material/Timeline";
import React, { FC, useState } from "react";
import { Link, useHref } from "react-router-dom";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import NavBarMenu from "./NavBarMenu/NavBarMenu";

const DashboardNavigationBar: FC = () => {
  const dashboardUri = useHref("/dashboard");
  const pages: Record<string, string> = {
    [useHref("/quote")]: "Stock Quote",
    [useHref("/investment")]: "Investment",
    [useHref("/portfolio")]: "My Portfolio",
    [useHref("/profile")]: "My Profile",
    [useHref("/setting")]: "Settings",
    [useHref("/logout")]: "Logout",
  };
  const [value, setValue] = useState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box>
        <AppBar position="sticky">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              <Link
                to={dashboardUri}
                style={{ textDecoration: "none", color: "#FFF" }}
              >
                aiFA
              </Link>
              <TimelineIcon sx={{ width: "1.5em" }} />
            </Typography>
            {isMatch ? (
              <>
                <DrawerMenu pages={pages} />
              </>
            ) : (
              <>
                <Tabs
                  textColor="inherit"
                  value={value}
                  onChange={(e, value) => setValue(value)}
                  indicatorColor="secondary"
                >
                  {Object.keys(pages)
                    .slice(0, Object.keys(pages).length - 3)
                    .map((path, index) => (
                      <Tab
                        key={index}
                        label={pages[path]}
                        href={path}
                        sx={{ padding: "12px 30px" }}
                      />
                    ))}
                </Tabs>
                <Button
                  color="inherit"
                  id="user-menu"
                  onClick={handleClick}
                  aria-controls={open ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                >
                  <MenuIcon />
                </Button>
                <NavBarMenu open={open} onClose={handleClose} />
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default DashboardNavigationBar;
