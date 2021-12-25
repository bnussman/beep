import React from "react";
import { EditDetails } from "./EditDetails";
import { EditLocation } from "./EditLocation";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Heading
} from "@chakra-ui/react";

export function Edit() {
  return (
    <Box>
      <Heading>Edit</Heading>
      <Tabs colorScheme="brand" lazyBehavior="keepMounted" isLazy>
        <TabList >
          <Tab>Details</Tab>
          <Tab>Location</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EditDetails />
          </TabPanel>
          <TabPanel>
            <EditLocation />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}