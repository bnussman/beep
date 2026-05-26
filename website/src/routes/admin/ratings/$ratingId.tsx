import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { printStars } from ".";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { DeleteRatingDialog } from "../../../components/DeleteRatingDialog";
import { useTRPC } from "../../../utils/trpc";
import { DateTime } from "luxon";
import {
  Link as RouterLink,
  useRouter,
  createFileRoute,
} from "@tanstack/react-router";
import {
  Alert,
  Typography,
  Button,
  Stack,
  Grid,
  Link,
  Card,
} from "@mui/material";

export const Route = createFileRoute("/admin/ratings/$ratingId")({
  component: Rating,
});

function Rating() {
  const trpc = useTRPC();
  const { ratingId } = Route.useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const {
    data: rating,
    isPending,
    error,
  } = useQuery(trpc.rating.rating.queryOptions(ratingId));

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const items = [
    {
      title: "Rater",
      content: <BasicUser user={rating.rater} />,
    },
    {
      title: "Rated",
      content: <BasicUser user={rating.rated} />,
    },

    {
      title: "Created",
      content: DateTime.fromISO(rating.timestamp).toRelative(),
    },
    {
      title: "Beep",
      content: (
        <Link component={RouterLink} to={`/admin/beeps/${rating.beep_id}`}>
          {rating.beep_id}
        </Link>
      ),
    },
    {
      title: "Stars",
      content: (
        <Typography>
          {printStars(rating.stars)} {rating.stars}
        </Typography>
      ),
    },
    {
      title: "Message",
      content: rating.message ?? "N/A",
    },
  ];

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
      <Card sx={{ p: 2, display: "flex", gap: 2, flexDirection: "column" }}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          {items.map((item) => (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight="bold" fontSize="0.95rem">
                {item.title}
              </Typography>
              {item.content}
            </Grid>
          ))}
        </Grid>
      </Card>
      <DeleteRatingDialog
        id={ratingId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => router.history.back()}
      />
    </Stack>
  );
}
