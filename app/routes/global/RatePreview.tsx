import React from "react";
import { Text, HStack, Stack, Heading } from "native-base";
import { gql, useQuery } from "@apollo/client";
import { GetRatingsQuery } from "../../generated/graphql";
import { Avatar } from "../../components/Avatar";
import { printStars } from "../../components/Stars";
import { Card } from "../../components/Card";

const Ratings = gql`
  query GetRatingsForUser($id: String) {
    getRatings(id: $id, show: 3, offset: 0, filter: "recieved") {
      items {
        id
        timestamp
        message
        stars
        rater {
          id
          name
          photoUrl
          username
        }
        rated {
          id
          name
          photoUrl
          username
        }
      }
      count
    }
  }
`;

interface Props {
  id: string;
}

export function RatePreview({ id }: Props) {
  const { data: ratingsData } = useQuery<GetRatingsQuery>(Ratings, {
    variables: { id },
  });

  const ratings = ratingsData?.getRatings.items;
  const count = ratingsData?.getRatings.count;

  if (!ratings || !count || count === 0) {
    return null;
  }

  return (
    <>
      <Heading mt={6}>Ratings</Heading>
      {ratings?.map((rating) => (
        <Card key={rating.id} p={2} my={2}>
          <HStack alignItems="center" p={2}>
            <Avatar size="lg" mr={4} url={rating.rater.photoUrl} />
            <Stack>
              <Text fontWeight="extrabold" fontSize="lg">
                {rating.rater.name}
              </Text>
              <Text color="gray.400" fontSize="xs" mb={1}>
                {new Date(rating.timestamp).toLocaleString()}
              </Text>
              <Text fontSize="xs">{printStars(rating.stars)}</Text>
            </Stack>
          </HStack>
          {rating.message ? <Text>{rating.message}</Text> : null}
        </Card>
      ))}
    </>
  );
}
