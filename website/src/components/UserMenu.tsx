import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { queryClient, trpc } from "../utils/trpc";
import { Menu, MenuItem, Button, Avatar } from "@mui/material";

export function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: user } = trpc.user.me.useQuery(undefined, {
    enabled: false,
    retry: false,
  });
  const { mutateAsync: logout } = trpc.auth.logout.useMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({});

      localStorage.removeItem("user");

      queryClient.resetQueries();

      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        id="user-button"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        startIcon={
          <Avatar
            sx={{ width: 24, height: 24 }}
            src={user?.photo ?? undefined}
          />
        }
      >
        {user?.username}
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-button",
        }}
      >
        <MenuItem component={Link} to="/profile/edit">
          Edit Account
        </MenuItem>
        <MenuItem component={Link} to="/password/change">
          Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout}>Sign out</MenuItem>
      </Menu>
    </div>
  );
}
