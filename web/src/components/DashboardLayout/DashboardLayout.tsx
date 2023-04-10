import { Box, CssBaseline, Toolbar } from "@mui/material";
import { FC, useState } from "react";
import NavigationBar from "./NavigationBar";
import DrawerMenu from "./DrawerMenu";
import { drawerWidth } from "./utils";
import { DrawerMenuItemModel } from "./DrawerMenuItem";
import { Outlet, useHref } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";

const DashboardLayout: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const menuItems: Array<DrawerMenuItemModel> = [
    { url: useHref("/dashboard/quote"), text: "Stock Quote" },
    { url: useHref("/dashboard/investment"), text: "Investment" },
    { url: useHref("/dashboard/portfolio"), text: "My Portfolio" },
  ];
  const userMenuItems: Array<DrawerMenuItemModel> = [
    { url: useHref("/user/profile"), text: "My Profile" },
    { url: useHref("/user/setting"), text: "Settings" },
    { url: useHref("/logout"), text: "Logout" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <NavigationBar
        toggleDrawer={toggleDrawer}
        menu={userMenuItems}
        menuIcon={<AccountCircle />}
      />
      <DrawerMenu
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        menuItems={menuItems}
        mobileMenuItems={userMenuItems}
      />
      <Box
        component="main"
        flexGrow={1}
        sx={{ width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
