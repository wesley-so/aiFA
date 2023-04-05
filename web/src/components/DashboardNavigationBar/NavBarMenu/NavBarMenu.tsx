import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { FC, MouseEventHandler, useState } from "react";
import { Link, useHref } from "react-router-dom";

interface NavBarMenuProps {
  open: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

const NavBarMenu: FC<NavBarMenuProps> = ({ open, onClose }) => {
  const logoutUri = useHref("/logout");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Menu
      id="user-menu"
      anchorEl={anchorEl}
      open={open}
      MenuListProps={{ "aria-labelledby": "user-menu" }}
      onClose={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "center" }}
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
  );
};

export default NavBarMenu;
