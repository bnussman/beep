import React from "react";
import { Menu, MenuItem, Button, Divider } from "@mui/material";
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
        <MenuItem component={Link} onClick={handleClose} to="/admin/users">
          Users
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleClose}
          to="/admin/users/domain"
        >
          Users by Domain
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleClose}
          to="/admin/leaderboards/beeps"
        >
          Leaderboards
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/beepers">
          Beepers
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleClose}
          to="/admin/beeps/active"
        >
          Beeps in progress
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/beeps">
          Beeps
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/reports">
          Reports
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/ratings">
          Ratings
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/cars">
          Cars
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleClose}
          to="/admin/notifications"
        >
          Notifications
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/feedback">
          Feedback
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/payments">
          Payments
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/redis">
          Redis
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/admin/health">
          Health
        </MenuItem>
        <Divider />
        <MenuItem
          component="a"
          target="_blank"
          href="https://osrm.ridebeep.app"
        >
          OSRM
        </MenuItem>
        <MenuItem
          component="a"
          target="_blank"
          href="https://grafana.ridebeep.app"
        >
          Grafana
        </MenuItem>
        <MenuItem
          component="a"
          target="_blank"
          href="https://ian-banks-llc.sentry.io"
        >
          Sentry
        </MenuItem>
      </Menu>
    </div>
  );
}
