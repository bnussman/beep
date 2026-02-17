import React, { useState } from "react";
import { printStars } from "./index";
import { BasicUser } from "../../../src/components/BasicUser";
import { Loading } from "../../../src/components/Loading";
import { DeleteRatingDialog } from "../../../src/components/admin/ratings/DeleteRatingDialog";
import { useTRPC } from "../../../src/utils/trpc";
import { DateTime } from "luxon";
import { Alert, Typography, Button, Stack, Grid, Link } from "@mui/material";
import {
  Link as RouterLink,
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/ratings/$ratingId")({
  component: Rating,
});

export function Rating() {
  const trpc = useTRPC();
  const { ratingId } = Route.useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const {
    data: rating,
    isLoading,
    error,
  } = useQuery(trpc.rating.rating.queryOptions(ratingId));

  if (isLoading || !rating) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Rating
        </Typography>
        <Button
          color="error"
          onClick={() => setIsOpen(true)}
          variant="contained"
        >
          Delete
        </Button>
      </Stack>
      <Grid container spacing={3}>
        <Grid size={{ sm: 6, xs: 12 }}>
          <Typography variant="h5" fontWeight="bold">
            Rater
          </Typography>
          <BasicUser user={rating.rater} />
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <Typography variant="h5" fontWeight="bold">
            Rated
          </Typography>
          <BasicUser user={rating.rated} />
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <Typography variant="h5" fontWeight="bold">
            Stars
          </Typography>
          <Typography>
            {printStars(rating.stars)} {rating.stars}
          </Typography>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <Typography variant="h5" fontWeight="bold">
            Message
          </Typography>
          <Typography>{rating.message ?? "N/A"}</Typography>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <Typography variant="h5" fontWeight="bold">
            Created
          </Typography>
          <Typography>
            {DateTime.fromISO(rating.timestamp).toRelative()}
          </Typography>
        </Grid>
        <Grid size={{ sm: 6, xs: 12 }}>
          <Typography variant="h5" fontWeight="bold">
            Beep
          </Typography>
          <Link component={RouterLink} to={`/admin/beeps/${rating.beep_id}`}>
            {rating.beep_id}
          </Link>
        </Grid>
      </Grid>
      <DeleteRatingDialog
        id={ratingId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => router.history.back()}
      />
    </Stack>
  );
}
