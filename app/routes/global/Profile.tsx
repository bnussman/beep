import React from "react";
import { gql, useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Container } from "../../components/Container";
import { Navigation } from "../../utils/Navigation";
import { GetRatingsQuery, GetUserProfileQuery, User } from "../../generated/graphql";
import { Avatar } from "../../components/Avatar";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Rating } from "../../components/Rating";
import {
  Spinner,
  Text,
  Stack,
  HStack,
  Heading,
  Spacer,
  Menu,
  Pressable,
  Icon,
  Box,
  Badge,
} from "native-base";

const GetUser = gql`
  query GetUserProfile($id: String!) {
    getUser(id: $id) {
      id
      name
      username
      name
      isBeeping
      isStudent
      role
      venmo
      cashapp
      singlesRate
      groupRate
      capacity
      photoUrl
      queueSize
      rating
    }
  }
`;

const Ratings = gql`
  query GetRatingsForUser($id: String) {
    getRatings(id: $id, show: 3, offset: 0) {
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

export function ProfileScreen() {
  const { params } = useRoute<any>();
  const navigation = useNavigation<Navigation>();

  const { data, loading, error } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: { id: params.id },
  });

  const { data: ratingsData } = useQuery<GetRatingsQuery>(Ratings, {
    variables: { id: params.id },
  });

  const ratings = ratingsData?.getRatings.items;
  const numberOfRatings = ratingsData?.getRatings.count;

  const handleReport = () => {
    navigation.navigate("Report", {
      user: data?.getUser as User,
      id: params.id,
      name: data?.getUser.name || "",
      beep: params.beep,
    });
  }

  const handleRate = () => {
    if (params.beep) {
      navigation.navigate("Rate", {
        user: data?.getUser as User,
        beep: params.beep,
      });
    } else {
      alert(
        "You can only leave a rating when you've interacted with this user."
      );
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu w="190" trigger={triggerProps => {
          return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <Icon mr={3} size="xl" as={Ionicons} name="ios-ellipsis-horizontal-circle" />
                </Pressable>;
        }}>
            <Menu.Item onPress={handleRate}>Rate</Menu.Item>
            <Menu.Item onPress={handleReport}>Report</Menu.Item>
          </Menu>
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>{error.message}</Text>
      </Container>
    );
  }

  if (!data?.getUser) {
    return (
      <Container alignItems="center" justifyContent="center">
        <Text>User does not exist</Text>
      </Container>
    );
  }

  return (
    <Container p={6} pt={4}>
      <HStack alignItems="center">
        <Stack>
          <Heading size="lg" fontWeight="extrabold">
            {data.getUser.name}
          </Heading>
          <Text color="gray.500">@{data.getUser.username}</Text>
        </Stack>
        <Spacer />
        <Avatar size="xl" url={data.getUser.photoUrl} />
      </HStack>
      <Stack space={2}>
        {data.getUser.isBeeping ? (
          <Text>
            <Text fontWeight="extrabold">Queue Size </Text>
            <Text>{data.getUser.queueSize}</Text>
          </Text>
        ) : null}
        {data?.getUser.venmo ? (
          <Text>
            <Text fontWeight="extrabold">Venmo </Text>
            <Text>@{data.getUser.venmo}</Text>
          </Text>
        ) : null}
        {data?.getUser.cashapp ? (
          <Text>
            <Text fontWeight="extrabold">Cash App </Text>
            <Text>@{data.getUser.cashapp}</Text>
          </Text>
        ) : null}
        <Text>
          <Text fontWeight="extrabold">Capacity </Text>
          <Text>{data.getUser.capacity}</Text>
        </Text>
        <Text>
          <Text fontWeight="extrabold">Singles Rate </Text>
          <Text>${data.getUser.singlesRate}</Text>
        </Text>
        <Text>
          <Text fontWeight="extrabold">Group Rate </Text>
          <Text>${data.getUser.groupRate}</Text>
        </Text>
        {data.getUser.rating ? (
          <Text>
            <Text fontWeight="extrabold">Rating </Text>
            <Text>{printStars(data.getUser.rating)}</Text>
          </Text>
        ) : null}
      </Stack>
      <Heading mt={6}>Ratings</Heading>
      {ratings?.map((rating) => (
        <Box
          my={2}
          p={2}
          _light={{ bg: "white", borderColor: "gray.100", borderWidth: 2 }}
          _dark={{ bg: "gray.900", borderColor: "gray.800" }}
          rounded="xl"
        >
          <HStack alignItems="center" p={2}>
            <Avatar
              size="lg"
              mr={4}
              url={rating.rater.photoUrl}
            />
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
        </Box>
      ))}
    </Container>
  );
}
