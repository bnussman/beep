import React from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import { Link } from "@tanstack/react-router";

export function AdminMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="admin-button"
        aria-controls={open ? "admin-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Admin
      </Button>
      <Menu
        id="admin-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "admin-button",
          },
        }}
      >
        <MenuItem component={Link} to="/admin/leaderboards/beeps">
          Leaderboards
        </MenuItem>
        <MenuItem component={Link} to="/admin/users">
          Users
        </MenuItem>
        <MenuItem component={Link} to="/admin/users/domain">
          Users by Domain
        </MenuItem>
        <MenuItem component={Link} to="/admin/beepers">
          Beepers
        </MenuItem>
        <MenuItem component={Link} to="/admin/beeps/active">
          Beeps in progress
        </MenuItem>
        <MenuItem component={Link} to="/admin/beeps">
          Beeps
        </MenuItem>
        <MenuItem component={Link} to="/admin/reports">
          Reports
        </MenuItem>
        <MenuItem component={Link} to="/admin/ratings">
          Ratings
        </MenuItem>
        <MenuItem component={Link} to="/admin/cars">
          Cars
        </MenuItem>
        <MenuItem component={Link} to="/admin/notifications">
          Notifications
        </MenuItem>
        <MenuItem component={Link} to="/admin/feedback">
          Feedback
        </MenuItem>
        <MenuItem component={Link} to="/admin/payments">
          Payments
        </MenuItem>
        <MenuItem component={Link} to="/admin/redis">
          Redis
        </MenuItem>
        <MenuItem component={Link} to="/admin/health">
          Health
        </MenuItem>
      </Menu>
    </div>
  );
}
