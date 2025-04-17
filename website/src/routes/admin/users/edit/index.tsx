import React from "react";
import { EditDetails } from "./EditDetails";
import { EditLocation } from "./EditLocation";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../User";
import { trpc } from "../../../../utils/trpc";
import { Alert } from "@mui/material";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Heading,
  Spinner,
} from "@chakra-ui/react";

export const editUserRoute = createRoute({
  component: Edit,
  path: "edit",
  getParentRoute: () => userRoute,
});

export function Edit() {
  const { userId } = editUserRoute.useParams();

  const { data: user, isLoading, error } = trpc.user.user.useQuery(userId);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Box>
      <Heading>Edit</Heading>
      <Tabs colorScheme="brand" lazyBehavior="keepMounted" isLazy>
        <TabList>
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
