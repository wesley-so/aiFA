import {
  AppBar,
  Box,
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import React, { FC, useState } from "react";
import { Link, useHref } from "react-router-dom";
import DrawerMenu from "../DrawerMenu/DrawerMenu";

const PAGES = ["Stock Quote", "Investment", "My Portfolio", "About Us"];

const DashboardNavigationBar: FC = () => {
  const dashboardUri = useHref("/dashboard");
  const logoutUri = useHref("/logout");
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to={dashboardUri}
                style={{ textDecoration: "none", color: "#FFF" }}
              >
                aiFA
              </Link>
              <TimelineIcon />
            </Typography>
            {isMatch ? (
              <>
                <DrawerMenu />
              </>
            ) : (
              <>
                <Tabs
                  textColor="inherit"
                  value={value}
                  onChange={(e, value) => setValue(value)}
                  indicatorColor="secondary"
                >
                  {PAGES.map((page, index) => (
                    <Tab key={index} label={page} />
                  ))}
                  <Button
                    color="inherit"
                    id="user-menu"
                    onClick={handleClick}
                    aria-controls={open ? "user-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  >
                    <AccountCircleIcon />
                  </Button>
                </Tabs>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  MenuListProps={{ "aria-labelledby": "user-menu" }}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <Link to={logoutUri} style={{ textDecoration: "none" }}>
                      Logout
                    </Link>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default DashboardNavigationBar;
