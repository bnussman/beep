import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Box, Flex, Heading, Pressable, Text } from "native-base";
import { GetRateDataQuery, User } from "../generated/graphql";
import { Navigation } from "../utils/Navigation";

export const GetRateData = gql`
  query GetRateData {
    getLastBeepToRate {
      id
      beeper {
        id
        name
        username
        photoUrl
      }
    }
  }
`;

interface Props {
  navigation: Navigation;
}

export function RateCard(props: Props): JSX.Element | null {
  const { data, loading } = useQuery<GetRateDataQuery>(GetRateData);

  if (loading || !data?.getLastBeepToRate) return null;

  return (
    <Box
      p={4}
      mt={2}
      _light={{ bg: "coolGray.50" }}
      _dark={{ bg: "gray.700" }}
      rounded="lg"
    >
      <Pressable
        onPress={() => {
          props.navigation.navigate("Rate", {
            id: data?.getLastBeepToRate?.beeper.id,
            user: data?.getLastBeepToRate?.beeper as User,
            beep: data?.getLastBeepToRate?.id,
          });
        }}
      >
        <Heading size="md" fontWeight="extrabold" mb={1}>
          Rate Your Last Beeper
        </Heading>
        <Flex direction="row" alignItems="center">
          <Avatar
            size={35}
            mr={2}
            source={{
              uri: data.getLastBeepToRate.beeper.photoUrl
                ? data.getLastBeepToRate.beeper.photoUrl
                : undefined,
            }}
          />
          <Text fontWeight="thin">{data?.getLastBeepToRate?.beeper.name}</Text>
        </Flex>
      </Pressable>
    </Box>
  );
}
