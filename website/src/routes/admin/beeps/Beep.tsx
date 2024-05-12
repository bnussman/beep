import React from "react";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { useQuery } from '@apollo/client';
import { Heading, Text, Box, Button, Flex, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { DeleteBeepDialog } from "./DeleteBeepDialog";
import { createRoute } from "@tanstack/react-router";
import { beepsRoute } from ".";
import { graphql } from "../../../graphql";

dayjs.extend(duration);

const GetBeep = graphql(`
  query GetBeep($id: String!) {
    getBeep(id: $id) {
      id
      origin
      destination
      start
      end
      groupSize
      beeper {
        id
        name
        photo
        username
      }
      rider {
        id
        name
        photo
        username
      }
    }
  }
`);

export const beepRoute = createRoute({
  component: Beep,
  path: "$beepId",
  getParentRoute: () => beepsRoute,
});

export function Beep() {
  const { beepId: id } = beepRoute.useParams();
  const { data, loading } = useQuery(GetBeep, { variables: { id } });

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box>
      <Flex align="center" mb={2}>
        <Heading>Beep</Heading>
        <Spacer />
        <Button
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          onClick={onOpen}
        >
          Delete
        </Button>
      </Flex>
      {loading && <Loading />}
      {data?.getBeep &&
        <Stack spacing={4}>
          <iframe
            title="Map"
            width="100%"
            height="300"
            src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_API_KEY || ''}&origin=${data.getBeep.origin}&destination=${data.getBeep.destination}`}>
          </iframe>
          <Box>
            <Heading>Beeper</Heading>
            <BasicUser user={data.getBeep.beeper} />
          </Box>
          <Box>
            <Heading>Rider</Heading>
            <BasicUser user={data.getBeep.rider} />
          </Box>
          <Box>
            <Heading>Origin</Heading>
            <Text>{data.getBeep.origin}</Text>
          </Box>
          <Box>
            <Heading>Destination</Heading>
            <Text>{data.getBeep.destination}</Text>
          </Box>
          <Box>
            <Heading>Group Size</Heading>
            <Text>{data.getBeep.groupSize}</Text>
          </Box>
          <Box>
            <Heading>Beep Started</Heading>
            <Text>{new Date(data.getBeep.start).toLocaleString()} - {dayjs().to(data.getBeep.start)}</Text>
          </Box>
          <Box>
            <Heading>Beep Ended</Heading>
            {data.getBeep.end ? (
              <Text>{new Date(data.getBeep.end).toLocaleString()} - {dayjs().to(data.getBeep.end)}</Text>
            ) : (
            <Text>Beep is still in progress</Text>
          )}
          </Box>
          <DeleteBeepDialog
            id={data.getBeep.id}
            isOpen={isOpen}
            onClose={onClose}
          />
        </Stack>
      }
    </Box>
  );
}
