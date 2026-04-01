import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { UserMenu } from "./UserMenu";
import { AdminMenu } from "./AdminMenu";
import { Link as RouterLink } from "@tanstack/react-router";
import { useTRPC } from "../utils/trpc";
import {
  AppBar,
  Stack,
  Toolbar,
  Typography,
  Button,
  Link,
  useColorScheme,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";

export function Header() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();

  const { data: user, isLoading } = useQuery(
    trpc.user.me.queryOptions(undefined, {
      retry: false,
      refetchOnWindowFocus: false,
    }),
  );

  useSubscription(
    trpc.user.updates.subscriptionOptions(undefined, {
      enabled: user !== undefined,
      onData(user) {
        queryClient.setQueryData(trpc.user.me.queryKey(), user);
      },
    }),
  );

  useEffect(() => {
    if (user) {
      Sentry.setUser(user);
    }
  }, [user]);

  return (
    <AppBar
      color="transparent"
      sx={(theme) => ({
        boxShadow: "none",
        borderBottom: 1,
        borderColor: theme.palette.divider,
        backdropFilter: "blur(5px)",
        ...(colorScheme === "dark" && {
          borderColor: "rgba(131, 131, 131, 0.1)",
          backgroundColor: "rgba(44, 44, 44, 0.1)",
        }),
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
          <Button component={RouterLink} to="/docs">
            Docs
          </Button>
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
