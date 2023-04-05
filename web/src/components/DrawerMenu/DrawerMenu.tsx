import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

interface DrawerMenuProps {
  pages: Record<string, string>;
}

const DrawerMenu: FC<DrawerMenuProps> = ({ pages }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleClose = () => {
    setOpenDrawer(false);
  };
  return (
    <React.Fragment>
      <Drawer open={openDrawer} onClose={handleClose}>
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
      </Drawer>
      <IconButton
        sx={{ color: "white", marginLeft: "auto" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </React.Fragment>
  );
};

export default DrawerMenu;
