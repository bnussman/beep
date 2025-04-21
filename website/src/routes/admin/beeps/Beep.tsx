import React, { useState } from "react";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { Typography, Button, Box, Stack, Alert } from "@mui/material";
import { DeleteBeepDialog } from "./DeleteBeepDialog";
import { createRoute } from "@tanstack/react-router";
import { beepsRoute } from ".";
import { trpc } from "../../../utils/trpc";
import { DateTime } from "luxon";

export const beepRoute = createRoute({
  component: Beep,
  path: "$beepId",
  getParentRoute: () => beepsRoute,
});

export function Beep() {
  const { beepId } = beepRoute.useParams();
  const { data: beep, isLoading, error } = trpc.beep.beep.useQuery(beepId);

  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !beep) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography>Beep</Typography>
        <Button color="error" onClick={() => setIsOpen(true)}>
          Delete
        </Button>
      </Stack>
      <iframe
        title="Map"
        width="100%"
        height="300"
        src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_API_KEY}&origin=${beep.origin}&destination=${beep.destination}`}
      />
      <Box>
        <Typography>Beeper</Typography>
        <BasicUser user={beep.beeper} />
      </Box>
      <Box>
        <Typography>Rider</Typography>
        <BasicUser user={beep.rider} />
      </Box>
      <Box>
        <Typography>Origin</Typography>
        <Typography>{beep.origin}</Typography>
      </Box>
      <Box>
        <Typography>Destination</Typography>
        <Typography>{beep.destination}</Typography>
      </Box>
      <Box>
        <Typography>Group Size</Typography>
        <Typography>{beep.groupSize}</Typography>
      </Box>
      <Box>
        <Typography>Beep Started</Typography>
        <Typography>
          {new Date(beep.start).toLocaleString()} -{" "}
          {DateTime.fromISO(beep.start).toRelative()}
        </Typography>
      </Box>
      <Box>
        <Typography>Beep Ended</Typography>
        {beep.end ? (
          <Typography>
            {new Date(beep.end).toLocaleString()} -{" "}
            {DateTime.fromISO(beep.end).toRelative()}
          </Typography>
        ) : (
          <Typography>Beep is still in progress</Typography>
        )}
      </Box>
      <DeleteBeepDialog
        id={beep.id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </Stack>
  );
}
