import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

interface ClipperDrawerMenuProps {
  pages: Record<string, string>;
}

const ClippedDrawerMenu: FC<ClipperDrawerMenuProps> = ({ pages }) => {
  const drawerWidth = 200;
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {Object.keys(pages)
              .slice(0, 3)
              .map((path, index) => (
                <ListItemButton key={index} component={Link} to={path}>
                  <ListItemIcon>
                    <ListItemText style={{ color: "black" }}>
                      {pages[path]}
                    </ListItemText>
                  </ListItemIcon>
                </ListItemButton>
              ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default ClippedDrawerMenu;
