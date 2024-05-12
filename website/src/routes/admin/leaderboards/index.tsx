import React from 'react'
import { Heading, Tabs, TabList, Tab, TabPanel, TabPanels, Stack } from "@chakra-ui/react"
import { Beeps } from './beeps';
import { Rides } from './rides';
import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '..';

export const leaderboardsRoute = createRoute({
  component: Leaderboards,
  path: 'leaderboards',
  getParentRoute: () => adminRoute,
  validateSearch: (search: Record<string, string>) => {
    return {
      page: Number(search?.page ?? 1),
    }
  },
});

export function Leaderboards() {
  return (
    <Stack>
      <Heading>Leaderboards</Heading>
      <Tabs isLazy colorScheme="brand">
        <TabList>
          <Tab>Beeps</Tab>
          <Tab>Rides</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Beeps />
          </TabPanel>
          <TabPanel>
            <Rides />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}