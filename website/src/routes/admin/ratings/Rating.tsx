import React from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { gql, useQuery } from '@apollo/client';
import { GetRatingQuery } from '../../../generated/graphql';
import { Heading, Text, Box, Button, Flex, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { printStars, ratingsRoute } from ".";
import { Error } from '../../../components/Error';
import { BasicUser } from "../../../components/BasicUser";
import { DeleteIcon } from "@chakra-ui/icons";
import { Loading } from "../../../components/Loading";
import { DeleteRatingDialog } from "./DeleteRatingDialog";
import { Link, Route } from "@tanstack/react-router";

dayjs.extend(relativeTime);

const GetRating = gql`
  query GetRating($id: String!) {
    getRating(id: $id) {
      id
      message
      stars
      timestamp
      beep {
        id
      }
      rater {
        id
        name
        photo
        username
      }
      rated {
        id
        name
        photo
        username
      }
    }
  }
`;

export const ratingRoute = new Route({
  component: Rating,
  path: "$ratingId",
  getParentRoute: () => ratingsRoute,
});

export function Rating() {
  const { ratingId: id } = ratingRoute.useParams();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { data, loading, error } = useQuery<GetRatingQuery>(GetRating, { variables: { id: id } });

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
      {error && <Error error={error} />}
      {loading && <Loading />}
      {data?.getRating &&
        <Stack spacing={6}>
          <Box>
            <Heading size="lg">Rater</Heading>
            <BasicUser user={data.getRating.rater} />
          </Box>
          <Box>
            <Heading size="lg">Rated</Heading>
            <BasicUser user={data.getRating.rated} />
          </Box>
          <Box>
            <Heading size="lg">Stars</Heading>
            <Text>{printStars(data.getRating.stars)} {data.getRating.stars}</Text>
          </Box>
          <Box>
            <Heading size="lg">Message</Heading>
            <Text>{data.getRating.message}</Text>
          </Box>
          <Box>
            <Heading size="lg">Created</Heading>
            <Text>{dayjs().to(data.getRating.timestamp)}</Text>
          </Box>
          {data.getRating.beep &&
            <Box>
              <Heading size="lg">Beep</Heading>
              <Link to="/admin/beeps/$beepId" params={{ beepId: data.getRating.beep.id }}>
                {data.getRating.beep.id}
              </Link>
            </Box>
          }
          <DeleteRatingDialog
            id={data.getRating.id}
            isOpen={isOpen}
            onClose={onClose}
          />
        </Stack>
      }
    </Box>
  );
}
