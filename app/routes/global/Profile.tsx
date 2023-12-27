import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Card } from "../../components/Card";
import { printStars } from "../../components/Stars";
import { Container } from "../../components/Container";
import { Navigation } from "../../utils/Navigation";
import { GetUserProfileQuery } from "../../generated/graphql";
import { Avatar } from "../../components/Avatar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RatePreview } from "./RatePreview";
import { useUser } from "../../utils/useUser";
import {
  Spinner,
  Text,
  Stack,
  XStack,
  Heading,
  Spacer,
  Popover,
  Button,
  YStack,
} from "tamagui";

export const GetUser = gql`
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
      photo
      queueSize
      rating
    }
  }
`;

export function ProfileScreen() {
  const { params } = useRoute<any>();
  const { user } = useUser();
  const navigation = useNavigation<Navigation>();

  const { data, loading, error } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: { id: params.id },
  });

  const handleReport = () => {
    navigation.navigate("Report", {
      userId: params.id,
      beepId: params.beepId,
    });
  };

  const handleRate = () => {
    navigation.navigate("Rate", {
      userId: params.id,
      beepId: params.beepId,
    });
  };

  React.useLayoutEffect(() => {
    if (user?.id !== params.id) {
      navigation.setOptions({
        headerRight: () => (
          <Popover size="$5" allowFlip>
            <Popover.Trigger asChild>
              <Button>...</Button>
            </Popover.Trigger>

            <Popover.Content
              borderWidth={1}
              borderColor="$borderColor"
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              elevate
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
            >
              <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

              <YStack space="$3">
                <Popover.Close asChild>
                  <Button
                    size="$3"
                    onPress={() => {
                      handleRate();
                    }}
                  >
                    Rate
                  </Button>
                </Popover.Close>
                <Popover.Close>
                <Button
                  size="$3"
                  onPress={() => {
                    handleReport();
                  }}
                >
                  Report
                </Button>
              </Popover.Close>
            </YStack>
          </Popover.Content>
          </Popover>
        ),
      });
}
  }, [navigation, params, data]);

  if (loading) {
    return (
      <Container center>
        <Spinner size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container center>
        <Text>{error.message}</Text>
      </Container>
    );
  }

  if (!data?.getUser) {
    return (
      <Container center>
        <Text>User does not exist</Text>
      </Container>
    );
  }

  return (
    <Container p={2}>
      <Stack space={2} flexShrink={1}>
        <Card>
          <XStack alignItems="center">
            <Stack>
              <Heading
                size="lg"
                letterSpacing="xs"
                fontWeight="extrabold"
                isTruncated
              >
                {data.getUser.name}
              </Heading>
              <Heading size="sm" color="gray.500">
                @{data.getUser.username}
              </Heading>
            </Stack>
            <Spacer />
            <Avatar
              size="lg"
              url={data.getUser.photo}
              online={data.getUser.isBeeping}
              badgeSize="6"
            />
          </XStack>
        </Card>
        <Card>
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
        </Card>
        <RatePreview id={params.id} />
      </Stack>
    </Container>
  );
}
