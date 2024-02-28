import React from "react";
import { useQuery } from "@apollo/client";
import { printStars } from "../../components/Stars";
import { Container } from "../../components/Container";
import { Avatar } from "../../components/Avatar";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { RatePreview } from "./RatePreview";
import { useUser } from "../../utils/useUser";
import { graphql } from "gql.tada";
import {
  Card,
  Spinner,
  Text,
  Stack,
  XStack,
  Heading,
  Menu,
  Button,
} from "@beep/ui";

export const GetUser = graphql(`
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
`);

type Props = StaticScreenProps<{ id: string, beepId?: string }>;

export function ProfileScreen({ route }: Props) {
  const { user } = useUser();
  const navigation = useNavigation();

  const { data, loading, error } = useQuery(GetUser, {
    variables: { id: route.params.id },
  });

  const handleReport = () => {
    navigation.navigate("Report", {
      userId: route.params.id,
      beepId: route.params.beepId,
    });
  };

  const handleRate = () => {
    if (!route.params.beepId) {
      alert("No beep to rate.");
    }

    navigation.navigate("Rate", {
      userId: route.params.id,
      beepId: route.params.beepId!,
    });
  };

  React.useLayoutEffect(() => {
    if (user?.id !== route.params.id) {
      navigation.setOptions({
        /*
        headerRight: () => (
          <Menu
            w="190"
            trigger={(triggerProps) => {
              return (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                >
                  <Icon
                    mr={3}
                    size="xl"
                    as={Ionicons}
                    name="ellipsis-horizontal-circle"
                  />
                </Pressable>
              );
            }}
          >
            {Boolean(route.params.beepId) && (
              <Menu.Item onPress={handleRate}>Rate</Menu.Item>
            )}
            <Menu.Item onPress={handleReport}>Report</Menu.Item>
          </Menu>
        ),
        */
        headerRight: () => (
          <Menu
            items={[
              { title: "Rate", onPress: handleRate },
              { title: "Report", onPress: handleReport },
            ]}
            Trigger={<Button>Menu</Button>}
          />
        ),
      });
    }
  }, [navigation, route.params, data]);

  if (loading) {
    return (
      <Container center>
        <Spinner />
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
    <Container p="$2">
      <Stack gap="$2" flexShrink={1}>
        <Card>
          <XStack alignItems="center">
            <Stack>
              <Heading fontWeight="bold">
                {data.getUser.name}
              </Heading>
              <Heading color="$gray6">
                @{data.getUser.username}
              </Heading>
            </Stack>
            <Stack flexGrow={1} />
            <Avatar
              url={data.getUser.photo}
            />
          </XStack>
        </Card>
        <Card>
          <Stack gap="$2">
            {data.getUser.isBeeping && (
              <Text>
                <Text fontWeight="bold">Queue Size </Text>
                <Text>{data.getUser.queueSize}</Text>
              </Text>
            )}
            {data?.getUser.venmo && (
              <Text>
                <Text fontWeight="bold">Venmo </Text>
                <Text>@{data.getUser.venmo}</Text>
              </Text>
            )}
            {data?.getUser.cashapp && (
              <Text>
                <Text fontWeight="bold">Cash App </Text>
                <Text>@{data.getUser.cashapp}</Text>
              </Text>
            )}
            <Text>
              <Text fontWeight="bold">Capacity </Text>
              <Text>{data.getUser.capacity}</Text>
            </Text>
            <Text>
              <Text fontWeight="bold">Singles Rate </Text>
              <Text>${data.getUser.singlesRate}</Text>
            </Text>
            <Text>
              <Text fontWeight="bold">Group Rate </Text>
              <Text>${data.getUser.groupRate}</Text>
            </Text>
            {data.getUser.rating && (
              <Text>
                <Text fontWeight="bold">Rating </Text>
                <Text>{printStars(data.getUser.rating)}</Text>
              </Text>
            )}
          </Stack>
        </Card>
        <RatePreview id={route.params.id} />
      </Stack>
    </Container>
  );
}
