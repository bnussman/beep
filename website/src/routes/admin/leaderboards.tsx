import React from 'react'
import { createFileRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { Tabs, Typography } from '@heroui/react';

export const Route = createFileRoute('/admin/leaderboards')({
  component: Leaderboards,
});

function Leaderboards() {
  const navigate = useNavigate({ from: Route.id });
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
    <div className="flex flex-col">
      <Typography type="h1">Leaderboards</Typography>
      <div className="flex flex-col gap-2">
        <Tabs
          selectedKey={selectedTab.id}
          onSelectionChange={(key) => {
            const nextTab = tabs.find((tab) => tab.id === key);
            if (nextTab) {
              navigate({
                to: "/admin/leaderboards/$",
                params: { _splat: nextTab.id },
                search: { page: 1 },
              });
            }
          }}
        >
          <Tabs.ListContainer className="border-b border-separator">
            <Tabs.List aria-label="Leaderboards">
              {tabs.map((tab) => (
                <Tabs.Tab id={tab.id} key={tab.id}>
                  {tab.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <Outlet />
      </div>
    </div>
  );
}
