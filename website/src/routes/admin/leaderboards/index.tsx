import React from 'react'
import { createRoute, Outlet, useLocation, useMatch } from '@tanstack/react-router';
import { adminRoute } from '..';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import { Link } from '@tanstack/react-router';

export const leaderboardsRoute = createRoute({
  component: Leaderboards,
  path: 'leaderboards',
  getParentRoute: () => adminRoute,
});

export function Leaderboards() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const tabs = [
    {
      label: "Beeps",
      href: "/admin/leaderboards/beeps",
    },
    {
      label: "Rides",
      href: "/admin/leaderboards/rides",
    },
  ];

  const index = tabs.findIndex(t => t.href === pathname)

  return (
    <Stack spacing={1}>
      <Typography variant="h5" fontWeight="bold">Leaderboards</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={index === -1 ? 0 : index}>
          {tabs.map((tab) => <Tab LinkComponent={Link} {...tab} />)}
        </Tabs>
      </Box>
      <Outlet />
    </Stack>
  );
}
