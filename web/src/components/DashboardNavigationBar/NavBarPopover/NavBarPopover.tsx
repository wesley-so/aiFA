import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { ListItemIcon, MenuItem, Popover } from "@mui/material";
import { FC, MouseEventHandler, useState } from "react";
import { Link, useHref } from "react-router-dom";

interface NavBarMenuProps {
  open: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

const NavBarPopover: FC<NavBarMenuProps> = ({ open, onClose }) => {
  const logoutUri = useHref("/logout");
  const profileUri = useHref("/profile");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Popover
      id="user-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Link to={profileUri} style={{ color: "black", textDecoration: "none" }}>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          My Profile
        </MenuItem>
      </Link>
      <Link to={""} style={{ color: "black", textDecoration: "none" }}>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Link>
      <Link to={logoutUri} style={{ color: "black", textDecoration: "none" }}>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Link>
    </Popover>
  );
};

export default NavBarPopover;
