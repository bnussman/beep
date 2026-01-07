import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "@tanstack/react-router";
import PeopleIcon from "@mui/icons-material/People";
import DomainIcon from "@mui/icons-material/Domain";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import CommuteIcon from "@mui/icons-material/Commute";
import AssessmentIcon from "@mui/icons-material/Assessment";
import StarIcon from "@mui/icons-material/Star";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PaymentIcon from "@mui/icons-material/Payment";
import StorageIcon from "@mui/icons-material/Storage";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MapIcon from "@mui/icons-material/Map";
import BarChartIcon from "@mui/icons-material/BarChart";
import BugReportIcon from "@mui/icons-material/BugReport";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloudIcon from "@mui/icons-material/Cloud";

const drawerWidth = 240;

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: <PeopleIcon /> },
  { label: "Users by Domain", href: "/admin/users/domain", icon: <DomainIcon /> },
  { label: "Leaderboards", href: "/admin/leaderboards/beeps", icon: <EmojiEventsIcon /> },
  { label: "Beepers", href: "/admin/beepers", icon: <LocationOnIcon /> },
  { label: "Beeps in progress", href: "/admin/beeps/active", icon: <DriveEtaIcon /> },
  { label: "Beeps", href: "/admin/beeps", icon: <CommuteIcon /> },
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
  { label: "OSRM", href: "https://osrm.ridebeep.app", icon: <MapIcon /> },
  { label: "Grafana", href: "https://grafana.ridebeep.app", icon: <BarChartIcon /> },
  { label: "Sentry", href: "https://ian-banks-llc.sentry.io", icon: <BugReportIcon /> },
];

const externalLinks2: NavItem[] = [
  { label: "Email", href: "https://mail.ridebeep.app", icon: <EmailIcon /> },
  { label: "Calendar", href: "https://calendar.ridebeep.app", icon: <CalendarTodayIcon /> },
  { label: "Drive", href: "https://drive.ridebeep.app", icon: <CloudIcon /> },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  // Helper function to check if a nav item should be highlighted
  const isActive = (itemHref: string): boolean => {
    if (pathname === itemHref) {
      return true;
    }
    // Check if this is a parent route (but not if there's a more specific match)
    if (pathname.startsWith(itemHref + "/")) {
      // Make sure there isn't a more specific nav item that matches
      const moreSpecificMatch = navItems.some(
        (navItem) =>
          navItem.href !== itemHref &&
          navItem.href.startsWith(itemHref) &&
          (pathname === navItem.href || pathname.startsWith(navItem.href + "/"))
      );
      return !moreSpecificMatch;
    }
    return false;
  };

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
                  selected={isActive(item.href)}
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
