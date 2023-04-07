import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

export interface DrawerMenuItemModel {
  url: string;
  text: string;
}

interface DrawerMenuItemProps {
  item: DrawerMenuItemModel;
  toggleDrawer: () => void;
}

const DrawerMenuItem: FC<DrawerMenuItemProps> = ({
  item: { url, text },
  toggleDrawer,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={url} onClick={toggleDrawer}>
        <ListItemText color="black">{text}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default DrawerMenuItem;
