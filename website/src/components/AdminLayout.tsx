import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "@tanstack/react-router";
import PeopleIcon from "@mui/icons-material/People";
import DomainIcon from "@mui/icons-material/Domain";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssessmentIcon from "@mui/icons-material/Assessment";
import StarIcon from "@mui/icons-material/Star";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PaymentIcon from "@mui/icons-material/Payment";
import StorageIcon from "@mui/icons-material/Storage";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const drawerWidth = 240;

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: <PeopleIcon /> },
  { label: "Users by Domain", href: "/admin/users/domain", icon: <DomainIcon /> },
  { label: "Leaderboards", href: "/admin/leaderboards/beeps", icon: <EmojiEventsIcon /> },
  { label: "Beepers", href: "/admin/beepers", icon: <LocationOnIcon /> },
  { label: "Beeps in progress", href: "/admin/beeps/active", icon: <DirectionsCarIcon /> },
  { label: "Beeps", href: "/admin/beeps", icon: <DirectionsCarIcon /> },
  { label: "Reports", href: "/admin/reports", icon: <AssessmentIcon /> },
  { label: "Ratings", href: "/admin/ratings", icon: <StarIcon /> },
  { label: "Cars", href: "/admin/cars", icon: <DirectionsCarIcon /> },
  { label: "Notifications", href: "/admin/notifications", icon: <NotificationsIcon /> },
  { label: "Feedback", href: "/admin/feedback", icon: <FeedbackIcon /> },
  { label: "Payments", href: "/admin/payments", icon: <PaymentIcon /> },
  { label: "Redis", href: "/admin/redis", icon: <StorageIcon /> },
  { label: "Health", href: "/admin/health", icon: <HealthAndSafetyIcon /> },
];

const externalLinks: NavItem[] = [
  { label: "OSRM", href: "https://osrm.ridebeep.app", icon: <OpenInNewIcon />, external: true },
  { label: "Grafana", href: "https://grafana.ridebeep.app", icon: <OpenInNewIcon />, external: true },
  { label: "Sentry", href: "https://ian-banks-llc.sentry.io", icon: <OpenInNewIcon />, external: true },
];

const externalLinks2: NavItem[] = [
  { label: "Email", href: "https://mail.ridebeep.app", icon: <OpenInNewIcon />, external: true },
  { label: "Calendar", href: "https://calendar.ridebeep.app", icon: <OpenInNewIcon />, external: true },
  { label: "Drive", href: "https://drive.ridebeep.app", icon: <OpenInNewIcon />, external: true },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.href}
                  selected={pathname === item.href || pathname.startsWith(item.href + "/")}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {externalLinks.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {externalLinks2.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
