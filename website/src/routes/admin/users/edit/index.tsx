import React from "react";
import { EditDetails } from "./EditDetails";
import { EditLocation } from "./EditLocation";
import { useQuery } from "@apollo/client";
import { GetUser, userRoute } from "../User";
import { Error } from '../../../../components/Error';
import { createRoute } from "@tanstack/react-router";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Heading,
  Spinner
} from "@chakra-ui/react";

export const editUserRoute = createRoute({
  component: Edit,
  path: 'edit',
  getParentRoute: () => userRoute,
});

export function Edit() {
  const { userId } = editUserRoute.useParams();
  const { data, loading, error } = useQuery(GetUser, { variables: { id: userId } });

  const user = data?.getUser;

  if (loading || !user) {
    return <Spinner />;
  }

  if (error) {
    return <Error error={error} />;
  }

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
            <EditDetails userId={userId} />
          </TabPanel>
          <TabPanel>
            <EditLocation />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
