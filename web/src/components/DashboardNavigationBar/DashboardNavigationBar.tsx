import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import ClippedDrawerMenu from "./ClippedDrawerMenu/ClippedDrawerMenu";
import NavBarPopover from "./NavBarPopover/NavBarPopover";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const open = Boolean(anchorEl);
  const smallDrawerWidth = 130;
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="sticky"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
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
              <IconButton
                sx={{ color: "white", marginLeft: "auto" }}
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
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
              <NavBarPopover open={open} onClose={handleClose} />
            </>
          )}
        </Toolbar>
      </AppBar>
      {isMatch ? (
        <>
          <Drawer
            sx={{
              width: smallDrawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: smallDrawerWidth,
                boxSizing: "border-box",
              },
            }}
            open={openDrawer}
            onClose={handleDrawerClose}
          >
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
              <List>
                {Object.keys(pages).map((path, index) => (
                  <ListItemButton onClick={handleClose} key={index}>
                    <Link to={path}>
                      <ListItemIcon>
                        <ListItemText>{pages[path]}</ListItemText>
                      </ListItemIcon>
                    </Link>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>
        </>
      ) : (
        <>
          <ClippedDrawerMenu pages={pages} />
        </>
      )}
    </Box>
  );
};

export default DashboardNavigationBar;
