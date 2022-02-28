import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Linking, Platform, Pressable } from "react-native";
import ActionButton from "../../components/ActionButton";
import { Navigation } from "../../utils/Navigation";
import { useQuery } from "@apollo/client";
import { UserData } from "../../App";
import { GetInitialQueueQuery, UserDataQuery } from "../../generated/graphql";
import AcceptDenyButton from "../../components/AcceptDenyButton";
import { Unpacked } from "../../utils/config";
import {
  Flex,
  Box,
  Avatar,
  HStack,
  VStack,
  Button,
  Text,
  Heading,
} from "native-base";

interface Props {
  item: Unpacked<GetInitialQueueQuery["getQueue"]>;
  index: number;
  navigation: Navigation;
}

export function QueueItem({ item, index, navigation }: Props) {
  const { data } = useQuery<UserDataQuery>(UserData);

  const user = data?.getUser;

  function handleDirections(origin: string, dest: string): void {
    if (Platform.OS == "ios") {
      Linking.openURL(`http://maps.apple.com/?saddr=${origin}&daddr=${dest}`);
    } else {
      Linking.openURL(`https://www.google.com/maps/dir/${origin}/${dest}/`);
    }
  }

  function handleVenmo(groupSize: string | number, venmo: string): void {
    if (Number(groupSize) > 1) {
      Linking.openURL(
        `venmo://paycharge?txn=pay&recipients=${venmo}&amount=${
          (user?.groupRate || 0) * Number(groupSize)
        }&note=Beep`
      );
    } else {
      Linking.openURL(
        `venmo://paycharge?txn=pay&recipients=${venmo}&amount=${user?.singlesRate}&note=Beep`
      );
    }
  }

  function handleCashApp(groupSize: string | number, cashapp: string): void {
    if (Number(groupSize) > 1) {
      Linking.openURL(
        `https://cash.app/$${cashapp}/${
          Number(groupSize) * (user?.groupRate || 0)
        }`
      );
    } else {
      Linking.openURL(`https://cash.app/$${cashapp}/${user?.singlesRate || 0}`);
    }
  }

  if (item.isAccepted) {
    return (
      <Box
        mx={4}
        my={2}
        px={4}
        py={4}
        _light={{ bg: "coolGray.100" }}
        _dark={{ bg: "gray.900" }}
        rounded="lg"
      >
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Pressable
              onPress={() =>
                navigation.navigate("Profile", {
                  id: item.rider.id,
                  beep: item.id,
                })
              }
            >
              <Flex direction="row" alignItems="center">
                <Avatar
                  size={50}
                  mr={2}
                  source={{
                    uri: item.rider.photoUrl ? item.rider.photoUrl : undefined,
                  }}
                />
                <Text bold fontSize="xl">
                  {item.rider.name}
                </Text>
                <HStack space={2} ml={4}>
                  <Button
                    onPress={() => {
                      Linking.openURL("tel:" + item.rider.phone);
                    }}
                    endIcon={
                      <MaterialCommunityIcons
                        name="phone"
                        color="white"
                        size={22}
                      />
                    }
                  />
                  <Button
                    onPress={() => {
                      Linking.openURL("sms:" + item.rider.phone);
                    }}
                    endIcon={
                      <MaterialCommunityIcons
                        name="message-text"
                        color="white"
                        size={22}
                      />
                    }
                  />
                </HStack>
              </Flex>
            </Pressable>
            <Text>
              <Text bold mr={2}>
                Group Size
              </Text>{" "}
              <Text>{item.groupSize}</Text>
            </Text>
            <Text>
              <Text bold mr={2}>
                Pick Up
              </Text>{" "}
              <Text>{item.origin}</Text>
            </Text>
            <Text>
              <Text bold mr={2}>
                Drop Off
              </Text>{" "}
              <Text>{item.destination}</Text>
            </Text>
          </Box>
        </Flex>
        <VStack space={2}>
          {item.rider?.venmo ? (
            <Button
              colorScheme="blue"
              variant="subtle"
              onPress={() => handleVenmo(item.groupSize, item.rider.venmo!)}
            >
              Request Money from Rider with Venmo
            </Button>
          ) : null}
          {item.rider?.cashapp ? (
            <Button
              colorScheme="green"
              variant="subtle"
              onPress={() => handleCashApp(item.groupSize, item.rider.cashapp!)}
            >
              Request Money from Rider with Cash App
            </Button>
          ) : null}
          {item.state <= 1 ? (
            <Button
              colorScheme="tertiary"
              onPress={() => handleDirections("Current+Location", item.origin)}
              endIcon={
                <MaterialCommunityIcons
                  name="map-legend"
                  color="white"
                  size={22}
                />
              }
            >
              Get Directions to Rider
            </Button>
          ) : (
            <Button
              onPress={() => handleDirections(item.origin, item.destination)}
              endIcon={
                <MaterialCommunityIcons
                  name="map-legend"
                  color="white"
                  size={22}
                />
              }
            >
              Get Directions for Beep
            </Button>
          )}
          <ActionButton item={item} index={index} />
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      mx={4}
      my={2}
      px={4}
      py={4}
      _light={{ bg: "coolGray.100" }}
      _dark={{ bg: "gray.900" }}
      rounded="lg"
    >
      <Box>
        <Pressable
          onPress={() =>
            navigation.navigate("Profile", {
              id: item.rider.id,
              beep: item.id,
            })
          }
        >
          <HStack alignItems="center">
            <Avatar
              mr={2}
              size={45}
              source={{
                uri: item.rider.photoUrl ? item.rider.photoUrl : undefined,
              }}
            />
            <Heading>{item.rider.name}</Heading>
          </HStack>
        </Pressable>
        <Text>
          <Text bold mr={2}>
            Entered Queue
          </Text>{" "}
          <Text>
            {new Date(item.start * 1000).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Text>
        </Text>
        <Text>
          <Text bold>Group Size</Text> <Text>{item.groupSize}</Text>
        </Text>
        <Text>
          <Text bold mr={2}>
            Pick Up
          </Text>{" "}
          <Text>{item.origin}</Text>
        </Text>
        <Text>
          <Text bold mr={2}>
            Drop Off
          </Text>{" "}
          <Text>{item.destination}</Text>
        </Text>
      </Box>
      <HStack space={2} mt={2}>
        <AcceptDenyButton type="deny" item={item} />
        <AcceptDenyButton type="accept" item={item} />
      </HStack>
    </Box>
  );
}
