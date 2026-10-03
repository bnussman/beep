import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { DeleteRatingDialog } from "../../../components/DeleteRatingDialog";
import { Link } from "../../../components/Link";
import { DateTime } from "luxon";
import {
  useRouter,
  createFileRoute,
} from "@tanstack/react-router";
import { Alert, Button, Typography } from "@heroui/react";
import { orpc } from "../../../utils/orpc";
import { printStars } from "../../../utils/utils";

export const Route = createFileRoute("/admin/ratings/$ratingId")({
  component: Rating,
});

function Rating() {
  const { ratingId } = Route.useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const {
    data: rating,
    isPending,
    error,
  } = useQuery(
    orpc.rating.rating.queryOptions({ input: ratingId })
  );

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    );
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
      content: DateTime.fromJSDate(rating.timestamp).toRelative(),
    },
    {
      title: "Beep",
      content: (
        <Link to="/admin/beeps/$beepId" params={{ beepId: rating.beep_id }}>
          {rating.beep_id}
        </Link>
      ),
    },
    {
      title: "Stars",
      content: (
        <Typography type="body">
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Typography type="h1">
          Rating
        </Typography>
        <Button variant="danger" onPress={() => setIsOpen(true)}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-separator bg-surface p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title}>
              <Typography type="body" className="text-[0.95rem] font-bold">
                {item.title}
              </Typography>
              {item.content}
            </div>
          ))}
        </div>
      </div>
      <DeleteRatingDialog
        id={ratingId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => router.history.back()}
      />
    </div>
  );
}
