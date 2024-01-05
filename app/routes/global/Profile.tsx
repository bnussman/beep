import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Card } from "../../components/Card";
import { printStars } from "../../components/Stars";
import { Container } from "../../components/Container";
import { GetUserProfileQuery } from "../../generated/graphql";
import { Avatar } from "../../components/Avatar";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { RatePreview } from "./RatePreview";
import { useUser } from "../../utils/useUser";
import {
  Spinner,
  Stack,
  XStack,
  Popover,
  Button,
  YStack,
  SizableText,
  H2,
} from "tamagui";
import { MoreHorizontal } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";

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

type Props = StaticScreenProps<{ id: string, beepId?: string }>;

export function ProfileScreen({ route }: Props) {
  const { user } = useUser();
  const navigation = useNavigation();

  const { data, loading, error } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: { id: route.params.id },
  });

  const handleReport = () => {
    navigation.navigate("Report", {
      userId: route.params.id,
      beepId: route.params.beepId,
    });
  };

  const handleRate = () => {
    navigation.navigate("Rate", {
      userId: route.params.id,
      beepId: route.params.beepId,
    });
  };

  React.useLayoutEffect(() => {
    if (user?.id !== route.params.id) {
      navigation.setOptions({
        headerRight: () => (
          <Popover size="$5" allowFlip>
            <Popover.Trigger asChild>
              <Pressable style={{ marginRight: 8 }}>
                <MoreHorizontal />
              </Pressable>
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
  }, [navigation, route.params, data]);

  if (loading) {
    return (
      <Container center>
        <Spinner size="small" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container center>
        <SizableText>{error.message}</SizableText>
      </Container>
    );
  }

  if (!data?.getUser) {
    return (
      <Container center>
        <SizableText>User does not exist</SizableText>
      </Container>
    );
  }

  return (
    <Container p="$2">
      <Stack space="$2" flexShrink={1}>
        <Card>
          <XStack alignItems="center" justifyContent="space-between">
            <Stack>
              <H2 fontWeight="bold">
                {data.getUser.name}
              </H2>
              <SizableText>
                @{data.getUser.username}
              </SizableText>
            </Stack>
            <Avatar
              size="$8"
              url={data.getUser.photo}
            />
          </XStack>
        </Card>
        <Card>
          <Stack space={2}>
            {data.getUser.isBeeping ? (
              <SizableText>
                <SizableText fontWeight="bold">Queue Size </SizableText>
                <SizableText>{data.getUser.queueSize}</SizableText>
              </SizableText>
            ) : null}
            {data?.getUser.venmo ? (
              <SizableText>
                <SizableText fontWeight="bold">Venmo </SizableText>
                <SizableText>@{data.getUser.venmo}</SizableText>
              </SizableText>
            ) : null}
            {data?.getUser.cashapp ? (
              <SizableText>
                <SizableText fontWeight="bold">Cash App </SizableText>
                <SizableText>@{data.getUser.cashapp}</SizableText>
              </SizableText>
            ) : null}
            <SizableText>
              <SizableText fontWeight="bold">Capacity </SizableText>
              <SizableText>{data.getUser.capacity}</SizableText>
            </SizableText>
            <SizableText>
              <SizableText fontWeight="bold">Singles Rate </SizableText>
              <SizableText>${data.getUser.singlesRate}</SizableText>
            </SizableText>
            <SizableText>
              <SizableText fontWeight="bold">Group Rate </SizableText>
              <SizableText>${data.getUser.groupRate}</SizableText>
            </SizableText>
            {data.getUser.rating ? (
              <SizableText>
                <SizableText fontWeight="bold">Rating </SizableText>
                <SizableText>{printStars(data.getUser.rating)}</SizableText>
              </SizableText>
            ) : null}
          </Stack>
        </Card>
        <RatePreview id={route.params.id} />
      </Stack>
    </Container>
  );
}
