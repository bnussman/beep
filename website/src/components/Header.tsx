import React from "react";
import { UserMenu } from "./UserMenu";
import { AdminMenu } from "./AdminMenu";
import { Link } from "@tanstack/react-router";
import { trpc } from "../utils/trpc";
import { AppBar, Stack, Toolbar, Typography, Button } from "@mui/material";

export function Header() {
  const { data: user } = trpc.user.me.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  return (
    <AppBar>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Link to="/">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                fontWeight="bold"
                variant="h1"
                fontSize="1.5rem"
                sx={{ display: { xs: "none", sm: "none", md: "block" } }}
              >
                Ride Beep App
              </Typography>
              <Typography fontSize="1.5rem">🚕</Typography>
            </Stack>
          </Link>
        </Stack>
        <Stack direction="row" spacing={1}>
          {user?.role === "admin" && <AdminMenu />}
          {user && <UserMenu />}
          {!user && (
            <>
              <Button component={Link} to="/login">
                Login
              </Button>
              <Button component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
