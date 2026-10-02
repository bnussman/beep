import React from 'react'
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Typography } from '@heroui/react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/leaderboards/')({
  component: Leaderboards,
});

function Leaderboards() {
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
    <div className="flex flex-col">
      <Typography type="h1">Leaderboards</Typography>
      <div className="flex flex-col gap-2">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={index === -1 ? 0 : index}>
            {tabs.map((tab) => <Tab LinkComponent={Link} {...tab} />)}
          </Tabs>
        </Box>
        <Outlet />
      </div>
    </div>
  );
}
