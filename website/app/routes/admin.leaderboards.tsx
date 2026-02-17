import React from 'react'
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute("/admin/leaderboards")({
  component: Leaderboards,
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
    <Stack>
      <Typography variant="h4" fontWeight="bold">Leaderboards</Typography>
      <Stack spacing={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={index === -1 ? 0 : index}>
            {tabs.map((tab) => <Tab LinkComponent={Link} {...tab} />)}
          </Tabs>
        </Box>
        <Outlet />
      </Stack>
    </Stack>
  );
}
