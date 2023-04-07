import { Box, Divider, Drawer, Toolbar } from "@mui/material";
import { FC } from "react";
import { drawerWidth } from "./utils";
import DrawerMenuItem, { DrawerMenuItemProps } from "./DrawerMenuItem";

interface DrawerMenuProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  menuItems?: Array<DrawerMenuItemProps>;
  mobileMenuItems?: Array<DrawerMenuItemProps>;
}

const DrawerMenu: FC<DrawerMenuProps> = ({
  isDrawerOpen,
  toggleDrawer,
  menuItems,
  mobileMenuItems,
}) => {
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <Toolbar />
        {menuItems?.map((item) => (
          <DrawerMenuItem key={JSON.stringify(item)} {...item} />
        ))}
        {menuItems && mobileMenuItems && <Divider />}
        {mobileMenuItems?.map((item) => (
          <DrawerMenuItem key={JSON.stringify(item)} {...item} />
        ))}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        <Toolbar />
        {menuItems?.map((item) => (
          <DrawerMenuItem key={JSON.stringify(item)} {...item} />
        ))}{" "}
      </Drawer>
    </Box>
  );
};

export default DrawerMenu;
