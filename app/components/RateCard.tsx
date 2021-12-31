import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Box, Flex, Pressable, Text } from "native-base";
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
  const { data, loading } = useQuery<GetRateDataQuery>(GetRateData, {
    fetchPolicy: "no-cache",
  });

  if (loading || !data?.getLastBeepToRate) return null;

  return (
    <Pressable
      onPress={() => {
        props.navigation.navigate("Rate", {
          id: data?.getLastBeepToRate?.beeper.id,
          user: data?.getLastBeepToRate?.beeper as User,
          beep: data?.getLastBeepToRate?.id,
        });
      }}
    >
      <Text>Rate Your Last Beeper:</Text>
      <Flex direction="row">
        <Avatar
          size={35}
          mr={2}
          source={{
            uri: data.getLastBeepToRate.beeper.photoUrl
              ? data.getLastBeepToRate.beeper.photoUrl
              : undefined,
          }}
        />
        <Box>
          <Text>{data?.getLastBeepToRate?.beeper.name}</Text>
          <Text>{data?.getLastBeepToRate?.beeper.username}</Text>
        </Box>
      </Flex>
    </Pressable>
  );
}
