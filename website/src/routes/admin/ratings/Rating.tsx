import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { printStars, ratingsRoute } from ".";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { DeleteRatingDialog } from "./DeleteRatingDialog";
import { DateTime } from "luxon";
import { Alert, Typography, Button, Stack, Grid, Link } from "@mui/material";
import {
  Link as RouterLink,
  createRoute,
  useRouter,
} from "@tanstack/react-router";

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
    isPending,
    error,
  } = useQuery(orpc.rating.rating.queryOptions({ input: ratingId }));

  if (isPending) {
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
            {DateTime.fromJSDate(rating.timestamp).toRelative()}
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
