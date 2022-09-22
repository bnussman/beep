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
  Heading,
  Spinner
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GetUserQuery } from "../../../../generated/graphql";
import { GetUser } from "../User";
import { Error } from '../../../../components/Error';

export function Edit() {
  const { id } = useParams();
  const { data, loading, error } = useQuery<GetUserQuery>(GetUser, { variables: { id } });

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
            <EditDetails user={user} />
          </TabPanel>
          <TabPanel>
            <EditLocation />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}