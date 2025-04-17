import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import {
  Heading,
  Text,
  Box,
  Button,
  Flex,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { DeleteBeepDialog } from "./DeleteBeepDialog";
import { createRoute } from "@tanstack/react-router";
import { beepsRoute } from ".";
import { trpc } from "../../../utils/trpc";
import { Alert } from "@mui/material";

dayjs.extend(duration);

export const beepRoute = createRoute({
  component: Beep,
  path: "$beepId",
  getParentRoute: () => beepsRoute,
});

export function Beep() {
  const { beepId } = beepRoute.useParams();
  const { data: beep, isLoading, error } = trpc.beep.beep.useQuery(beepId);

  const { isOpen, onClose, onOpen } = useDisclosure();

  if (isLoading || !beep) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Box>
      <Flex align="center" mb={2}>
        <Heading>Beep</Heading>
        <Spacer />
        <Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={onOpen}>
          Delete
        </Button>
      </Flex>
      <Stack spacing={4}>
        <iframe
          title="Map"
          width="100%"
          height="300"
          src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_API_KEY || ""}&origin=${beep.origin}&destination=${beep.destination}`}
        ></iframe>
        <Box>
          <Heading>Beeper</Heading>
          <BasicUser user={beep.beeper} />
        </Box>
        <Box>
          <Heading>Rider</Heading>
          <BasicUser user={beep.rider} />
        </Box>
        <Box>
          <Heading>Origin</Heading>
          <Text>{beep.origin}</Text>
        </Box>
        <Box>
          <Heading>Destination</Heading>
          <Text>{beep.destination}</Text>
        </Box>
        <Box>
          <Heading>Group Size</Heading>
          <Text>{beep.groupSize}</Text>
        </Box>
        <Box>
          <Heading>Beep Started</Heading>
          <Text>
            {new Date(beep.start).toLocaleString()} - {dayjs().to(beep.start)}
          </Text>
        </Box>
        <Box>
          <Heading>Beep Ended</Heading>
          {beep.end ? (
            <Text>
              {new Date(beep.end).toLocaleString()} - {dayjs().to(beep.end)}
            </Text>
          ) : (
            <Text>Beep is still in progress</Text>
          )}
        </Box>
        <DeleteBeepDialog id={beep.id} isOpen={isOpen} onClose={onClose} />
      </Stack>
    </Box>
  );
}
