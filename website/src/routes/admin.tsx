import {
  Assessment,
  CalendarMonth,
  ChevronLeft,
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
} from "@mui/material";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
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
  const [expanded, setExpanded] = React.useState(true);
  const width = expanded ? 240 : 64;

  return (
    <Box sx={{ display: "flex", minWidth: 0, flexGrow: 1, gap: 2 }}>
      <Drawer
        variant="permanent"
        sx={{
          width,
          flexShrink: 0,
          transition: "width 180ms ease",
          "& .MuiDrawer-paper": {
            position: "relative",
            boxSizing: "border-box",
            width,
            overflowX: "hidden",
            transition: "width 180ms ease",
          },
        }}
      >
        <Box
          sx={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: expanded ? "space-between" : "center",
            px: 1,
          }}
        >
          {expanded && <Typography sx={{ fontWeight: 700 }}>Admin</Typography>}
          <IconButton
            aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider />
        <List dense>
          {adminLinks.map(({ label, to, icon }) => (
            <Tooltip key={to} title={expanded ? "" : label} placement="right">
              <ListItemButton
                component={Link}
                to={to}
                sx={{ minHeight: 44, justifyContent: expanded ? "initial" : "center", px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: expanded ? 2 : 0 }}>
                  {icon}
                </ListItemIcon>
                {expanded && <ListItemText primary={label} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
        <Divider />
        <List dense>
          {externalLinks.map(({ label, href, icon }) => (
            <Tooltip key={href} title={expanded ? "" : label} placement="right">
              <ListItemButton
                component="a"
                href={href}
                target="_blank"
                rel="noreferrer"
                sx={{ minHeight: 44, justifyContent: expanded ? "initial" : "center", px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: expanded ? 2 : 0 }}>
                  {icon}
                </ListItemIcon>
                {expanded && <ListItemText primary={label} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Box component="section" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
