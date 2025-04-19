import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { printStars, ratingsRoute } from ".";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { DeleteRatingDialog } from "./DeleteRatingDialog";
import { Link, createRoute, useRouter } from "@tanstack/react-router";
import { trpc } from "../../../utils/trpc";
import { Alert, Box, Typography, Button, Stack } from "@mui/material";

dayjs.extend(relativeTime);

export const ratingRoute = createRoute({
  component: Rating,
  path: "$ratingId",
  getParentRoute: () => ratingsRoute,
});

export function Rating() {
  const { ratingId } = ratingRoute.useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const {
    data: rating,
    isLoading,
    error,
  } = trpc.rating.rating.useQuery(ratingId);

  if (isLoading || !rating) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Stack justifyContent="space-between" alignItems="center">
        <Typography>Rating</Typography>
        <Button
          color="error"
          onClick={() => setIsOpen(true)}
          variant="contained"
        >
          Delete
        </Button>
      </Stack>
      <Box>
        <Typography>Rater</Typography>
        <BasicUser user={rating.rater} />
      </Box>
      <Box>
        <Typography>Rated</Typography>
        <BasicUser user={rating.rated} />
      </Box>
      <Box>
        <Typography>Stars</Typography>
        <Typography>
          {printStars(rating.stars)} {rating.stars}
        </Typography>
      </Box>
      <Box>
        <Typography>Message</Typography>
        <Typography>{rating.message}</Typography>
      </Box>
      <Box>
        <Typography>Created</Typography>
        <Typography>{dayjs().to(rating.timestamp)}</Typography>
      </Box>
      {rating.beep_id && (
        <Box>
          <Typography>Beep</Typography>
          <Link to="/admin/beeps/$beepId" params={{ beepId: rating.beep_id }}>
            {rating.beep_id}
          </Link>
        </Box>
      )}
      <DeleteRatingDialog
        id={ratingId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => router.history.back()}
      />
    </Stack>
  );
}
