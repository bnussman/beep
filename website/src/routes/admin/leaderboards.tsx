import React from 'react'
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { Tabs, Typography } from '@heroui/react';

export const Route = createFileRoute('/admin/leaderboards')({
  component: Leaderboards,
});

function Leaderboards() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const tabs = [
    {
      id: "beeps",
      label: "Beeps",
      to: "/admin/leaderboards/beeps",
    },
    {
      id: "rides",
      label: "Rides",
      to: "/admin/leaderboards/rides",
    },
  ] as const;

  const selectedTab = tabs.find((tab) => tab.to === pathname) ?? tabs[0];

  return (
    <div className="flex flex-col gap-4">
      <Typography type="h1">Leaderboards</Typography>
      <Tabs selectedKey={selectedTab.id}>
        <Tabs.ListContainer>
          <Tabs.List aria-label="Leaderboards">
            {tabs.map((tab) => (
              <Tabs.Tab
                id={tab.id}
                key={tab.id}
                render={(props: any) => <Link to={tab.to} {...props} />}
              >
                {tab.label}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
      <Outlet />
    </div>
  );
}
