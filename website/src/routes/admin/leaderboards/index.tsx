import React from 'react'
import { Heading, Box, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react"
import { Beeps } from './beeps';
import { Rides } from './rides';

export function Leaderboards() {
  return (
    <Box>
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
    </Box>
  );
}