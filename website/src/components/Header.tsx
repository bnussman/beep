import React from "react";
import { UserMenu } from "./UserMenu";
import { AdminMenu } from "./AdminMenu";
import { Link as RouterLink } from "@tanstack/react-router";
import { trpc } from "../utils/trpc";
import { AppBar, Stack, Toolbar, Typography, Button, Link } from "@mui/material";

export function Header() {
  const { data: user } = trpc.user.me.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  return (
    <AppBar
      color="transparent"
      sx={(theme) => ({
        boxShadow: 'none',
        borderBottom: 1,
        borderColor: theme.palette.divider,
        backdropFilter: 'blur(10px)'
      })}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Link component={RouterLink} to="/">
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
        <Stack direction="row" alignItems="center" spacing={1}>
          {user?.role === "admin" && <AdminMenu />}
          {user && <UserMenu />}
          {!user && (
            <>
              <Button component={RouterLink} to="/login">
                Login
              </Button>
              <Button component={RouterLink} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
