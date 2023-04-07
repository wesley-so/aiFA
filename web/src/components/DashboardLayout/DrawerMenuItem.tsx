import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FC } from "react";

export interface DrawerMenuItemProps {
  url: string;
  text: string;
}

const DrawerMenuItem: FC<DrawerMenuItemProps> = ({ url, text }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton href={url}>
        <ListItemText color="black">{text}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default DrawerMenuItem;
