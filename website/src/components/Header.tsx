import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useSubscription } from "../utils/subscriptions";
import { orpc } from "../utils/orpc";
import { UserMenu } from "./UserMenu";
import { AdminMenu } from "./AdminMenu";
import { Link as RouterLink } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AppBar,
  Stack,
  Toolbar,
  Typography,
  Button,
  Link,
} from "@mui/material";

export function Header() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery(
    orpc.user.me.queryOptions({
      retry: false,
      refetchOnWindowFocus: false,
    }),
  );

  useSubscription({
    ...orpc.user.updates.liveOptions({
      enabled: user !== undefined,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(orpc.user.me.queryKey(), data);
    }
  })

  useEffect(() => {
    Sentry.setUser(user ?? null);
  }, [user]);

  return (
    <AppBar
      color="transparent"
      sx={(theme) => ({
        boxShadow: "none",
        borderBottom: 1,
        borderColor: `light-dark(${theme.palette.divider}, rgba(131, 131, 131, 0.1))`,
        backgroundColor: "light-dark(transparent, rgba(44, 44, 44, 0.1))",
        backdropFilter: "blur(5px)",
      })}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Link component={RouterLink} to="/">
            <Stack direction="row" alignItems="center" gap={2}>
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
              <Button component={RouterLink} to="/signup" variant="contained">
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
