import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useSubscription } from "../utils/subscriptions";
import { orpc } from "../utils/orpc";
import { UserMenu } from "./UserMenu";
import { AdminMenu } from "./AdminMenu";
import { useAdminNavigation } from "./AdminNavigationContext";
import { Link as RouterLink } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Stack,
  Toolbar,
  Typography,
  Button,
  Link,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

export function Header({ isAdminRoute = false }: { isAdminRoute?: boolean }) {
  const { expanded, setExpanded } = useAdminNavigation();
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
      position="fixed"
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
        <Stack direction="row" spacing={4} sx={{
          alignItems: "center"
        }}>
          {isAdminRoute && (
            <>
              <Tooltip title={expanded ? "Collapse navigation" : "Expand navigation"}>
                <IconButton
                  aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
                  onClick={() => setExpanded(!expanded)}
                  color="inherit"
                  size="small"
                >
                  {expanded ? <ChevronLeft /> : <MenuIcon />}
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: "center" }} />
            </>
          )}
          <Link component={RouterLink} to="/">
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 2
              }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  display: { xs: "none", sm: "none", md: "block" }
                }}>
                Ride Beep App
              </Typography>
              <Typography sx={{
                fontSize: "1.5rem"
              }}>🚕</Typography>
            </Stack>
          </Link>
        </Stack>
        <Stack direction="row" spacing={1} sx={{
          alignItems: "center"
        }}>
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
