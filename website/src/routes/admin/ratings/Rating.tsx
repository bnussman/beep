import React from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Heading, Text, Box, Button, Flex, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { printStars, ratingsRoute } from ".";
import { Error } from '../../../components/Error';
import { BasicUser } from "../../../components/BasicUser";
import { DeleteIcon } from "@chakra-ui/icons";
import { Loading } from "../../../components/Loading";
import { DeleteRatingDialog } from "./DeleteRatingDialog";
import { Link, createRoute } from "@tanstack/react-router";
import { trpc } from "../../../utils/trpc";

dayjs.extend(relativeTime);

export const ratingRoute = createRoute({
  component: Rating,
  path: "$ratingId",
  getParentRoute: () => ratingsRoute,
});

export function Rating() {
  const { ratingId } = ratingRoute.useParams();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data: rating, isLoading, error } = trpc.rating.rating.useQuery(ratingId);

  if (isLoading || !rating) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>
  }

  return (
    <Box>
      <Flex align='center' mb={4}>
        <Heading>Rating</Heading>
        <Spacer />
        <Button
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          onClick={onOpen}
        >
          Delete
        </Button>
      </Flex>
        <Stack spacing={6}>
        <Box>
          <Heading size="lg">Rater</Heading>
          <BasicUser user={rating.rater} />
        </Box>
        <Box>
          <Heading size="lg">Rated</Heading>
          <BasicUser user={rating.rated} />
        </Box>
        <Box>
          <Heading size="lg">Stars</Heading>
          <Text>{printStars(rating.stars)} {rating.stars}</Text>
        </Box>
        <Box>
          <Heading size="lg">Message</Heading>
          <Text>{rating.message}</Text>
        </Box>
        <Box>
          <Heading size="lg">Created</Heading>
          <Text>{dayjs().to(rating.timestamp)}</Text>
        </Box>
        {rating.beep_id && (
          <Box>
            <Heading size="lg">Beep</Heading>
            <Link to="/admin/beeps/$beepId" params={{ beepId: rating.beep_id }}>
              {rating.beep_id}
            </Link>
          </Box>
        )}
        <DeleteRatingDialog
          id={ratingId}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Stack>
    </Box>
  );
}
