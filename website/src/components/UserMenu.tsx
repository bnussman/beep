import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { queryClient, useTRPC } from "../utils/trpc";
import { Menu, MenuItem, Button, Avatar, Divider } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export function UserMenu() {
  const trpc = useTRPC();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: user } = useQuery(
    trpc.user.me.queryOptions(undefined, {
      enabled: false,
      retry: false,
    }),
  );
  const { mutateAsync: logout } = useMutation(
    trpc.auth.logout.mutationOptions(),
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({});

      localStorage.removeItem("user");

      queryClient.resetQueries();

      handleClose();

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
        <MenuItem component={Link} onClick={handleClose} to="/profile/edit">
          Edit Account
        </MenuItem>
        <MenuItem component={Link} onClick={handleClose} to="/password/change">
          Change Password
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={(theme) => ({ color: theme.palette.error.light })}
        >
          Sign out
        </MenuItem>
      </Menu>
    </div>
  );
}
