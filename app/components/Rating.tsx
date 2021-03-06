import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Flex, HStack, Pressable, Spacer, Stack, Text } from 'native-base';
import { GetRatingsQuery } from '../generated/graphql';
import { Navigation } from '../utils/Navigation';
import { useUser } from '../utils/useUser';
import { Avatar } from './Avatar';
import { printStars } from './Stars';
import { Unpacked } from '../utils/constants';

interface Props {
  item: Unpacked<GetRatingsQuery['getRatings']['items']>;
  index: number;
}

export function Rating(props: Props) {
  const { item, index } = props;
  const { user } = useUser();
  const navigation = useNavigation<Navigation>();
  const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

    return (
      <Pressable
        mx={4}
        my={2}
        p={5}
        mt={index === 0 ? 4 : undefined}
        _light={{ bg: "white", borderColor: "gray.100", borderWidth: 2 }}
        _dark={{ bg: "gray.900", borderColor: "gray.800" }}
        _pressed={{ _light: { bg: "coolGray.100" }, _dark: { bg: "gray.800" } }}
        rounded="xl"
        onPress={() => navigation.push("Profile", { id: otherUser.id })}
      >
        <HStack alignItems="center" p={2}>
          <Avatar
            size={50}
            mr={4}
            url={otherUser.photoUrl}
          />
          <Stack space={2}>
            <Text>
              {user?.id === item.rater.id ? (
                <Flex direction="row" alignItems="center">
                  <Text _dark={{ color: "white" }} fontSize="md">
                    You rated
                  </Text>{" "}
                  <Text bold fontSize="md" _dark={{ color: "white" }}>
                    {otherUser.name}
                  </Text>
                </Flex>
              ) : (
                <Flex direction="row" alignItems="center">
                  <Text bold fontSize="md" _dark={{ color: "white" }}>
                    {otherUser.name}
                  </Text>{" "}
                  <Text fontSize="md" _dark={{ color: "white" }}>
                    rated you
                  </Text>
                </Flex>
              )}
            </Text>
            <Text>{printStars(item.stars)}</Text>
            {item.message ? <Text>{item.message}</Text> : null}
          </Stack>
          <Spacer />
        </HStack>
      </Pressable>
    );
}