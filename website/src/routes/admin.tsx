import {
  Assessment,
  CalendarMonth,
  ChevronLeft,
  Close,
  DirectionsCar,
  DriveFileMove,
  Email,
  EmojiEvents,
  Feedback,
  HealthAndSafety,
  Map,
  Menu as MenuIcon,
  Notifications,
  People,
  Payments,
  Public,
  Star,
  Storage,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useAdminNavigation } from "../components/AdminNavigationContext";
import React from "react";

const adminLinks = [
  { label: "Users", to: "/admin/users", icon: <People /> },
  { label: "Users by Domain", to: "/admin/users/domain", icon: <Public /> },
  {
    label: "Leaderboards",
    to: "/admin/leaderboards/beeps",
    icon: <EmojiEvents />,
  },
  { label: "Beepers", to: "/admin/beepers", icon: <People /> },
  { label: "Beeps in progress", to: "/admin/beeps/active", icon: <Map /> },
  { label: "Beeps", to: "/admin/beeps", icon: <Assessment /> },
  { label: "Reports", to: "/admin/reports", icon: <Assessment /> },
  { label: "Ratings", to: "/admin/ratings", icon: <Star /> },
  { label: "Cars", to: "/admin/cars", icon: <DirectionsCar /> },
  {
    label: "Notifications",
    to: "/admin/notifications",
    icon: <Notifications />,
  },
  { label: "Feedback", to: "/admin/feedback", icon: <Feedback /> },
  { label: "Payments", to: "/admin/payments", icon: <Payments /> },
  { label: "Redis", to: "/admin/redis", icon: <Storage /> },
  {
    label: "Health",
    to: "/admin/health",
    icon: <HealthAndSafety />,
  },
] as const;

const externalLinks = [
  { label: "OSRM", href: "https://osrm.ridebeep.app", icon: <Map /> },
  {
    label: "Grafana",
    href: "https://grafana.ridebeep.app",
    icon: <Assessment />,
  },
  {
    label: "Sentry",
    href: "https://ian-banks-llc.sentry.io",
    icon: <HealthAndSafety />,
  },
  { label: "Email", href: "https://mail.ridebeep.app", icon: <Email /> },
  {
    label: "Calendar",
    href: "https://calendar.ridebeep.app",
    icon: <CalendarMonth />,
  },
  {
    label: "Drive",
    href: "https://drive.ridebeep.app",
    icon: <DriveFileMove />,
  },
];

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { expanded, drawerOpen, setDrawerOpen } = useAdminNavigation();
  const isSmallViewport = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const drawerExpanded = isSmallViewport || expanded;
  const width = drawerExpanded ? 240 : 64;
  const closeOnSmallViewport = () => {
    if (isSmallViewport) setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minWidth: 0, flexGrow: 1, gap: { md: 2 } }}>
      <Drawer
        variant={isSmallViewport ? "temporary" : "permanent"}
        open={!isSmallViewport || drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: isSmallViewport ? undefined : width,
          flexShrink: 0,
          position: isSmallViewport ? "fixed" : "sticky",
          top: isSmallViewport ? 0 : { xs: 56, sm: 64 },
          height: isSmallViewport
            ? "100dvh"
            : { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
          alignSelf: "flex-start",
          transition: "width 180ms ease",
          "& .MuiDrawer-paper": {
            position: isSmallViewport ? "fixed" : "relative",
            boxSizing: "border-box",
            width: isSmallViewport ? 280 : width,
            height: isSmallViewport ? "100dvh" : "100%",
            overflowX: "hidden",
            overflowY: "auto",
            top: isSmallViewport ? 0 : undefined,
            transition: "width 180ms ease",
          },
        }}
      >
        {isSmallViewport && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Admin</Typography>
              <IconButton
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>
            <Divider />
          </>
        )}
        <List dense>
          {adminLinks.map(({ label, to, icon }) => (
            <Tooltip
              key={to}
              title={drawerExpanded ? "" : label}
              placement="right"
            >
              <ListItemButton
                component={Link}
                to={to}
                onClick={closeOnSmallViewport}
                sx={{ minHeight: 44, justifyContent: drawerExpanded ? "initial" : "center", px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: drawerExpanded ? 2 : 0 }}>
                  {icon}
                </ListItemIcon>
                {drawerExpanded && <ListItemText primary={label} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
        <Divider />
        <List dense>
          {externalLinks.map(({ label, href, icon }) => (
            <Tooltip
              key={href}
              title={drawerExpanded ? "" : label}
              placement="right"
            >
              <ListItemButton
                component="a"
                href={href}
                target="_blank"
                rel="noreferrer"
                onClick={closeOnSmallViewport}
                sx={{ minHeight: 44, justifyContent: drawerExpanded ? "initial" : "center", px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: drawerExpanded ? 2 : 0 }}>
                  {icon}
                </ListItemIcon>
                {drawerExpanded && <ListItemText primary={label} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Box
        component="section"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          paddingY: 2,
          paddingRight: { xs: 0, md: 4 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
