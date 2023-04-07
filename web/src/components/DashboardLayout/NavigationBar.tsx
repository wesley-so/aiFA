import { MoreVert, Timeline } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, MouseEventHandler, ReactNode, useState } from "react";
import { Link, useHref } from "react-router-dom";
import { drawerWidth } from "./utils";
import { DrawerMenuItemModel } from "./DrawerMenuItem";

interface NavigationBarProps {
  toggleDrawer: () => void;
  menuIcon?: ReactNode;
  menu?: Array<DrawerMenuItemModel>;
}

const NavigationBar: FC<NavigationBarProps> = ({
  toggleDrawer,
  menuIcon,
  menu,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const dashboardUri = useHref("/dashboard");

  const toggleMenu: MouseEventHandler<HTMLElement> = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box component="div">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            to={dashboardUri}
            noWrap
            variant="h6"
            paddingRight="auto"
            sx={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            aiFA
            <Timeline sx={{ ml: "4px" }} />
          </Typography>
        </Box>
        <Box component="div" sx={{ display: { xs: "none", md: "initial" } }}>
          <IconButton
            size="large"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={toggleMenu}
            color="inherit"
          >
            {menuIcon ?? <MoreVert />}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={menuAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={menuAnchorEl !== null}
            onClose={closeMenu}
          >
            {menu?.map((item) => (
              <MenuItem
                key={JSON.stringify(item)}
                onClick={closeMenu}
                component={Link}
                to={item.url}
              >
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
