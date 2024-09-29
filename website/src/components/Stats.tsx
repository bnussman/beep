import React from "react";
import { trpc } from "../utils/trpc";
import { Skeleton, Stat, StatGroup, StatLabel, StatNumber } from "@chakra-ui/react";

export function Stats() {
  const utils = trpc.useUtils();
  const { data: userCount, isLoading: isLoadingUserCount } = trpc.user.userCount.useQuery();
  const { data: beepCount, isLoading: isLoadingBeepCount } = trpc.beep.beepsCount.useQuery();

  trpc.user.numberOfUsersSubscription.useSubscription(undefined, {
    onData(action) {
      utils.user.userCount.setData(undefined, (prev) => {
        if (prev === undefined) {
          return;
        }
        if (action === "increment") {
          return prev + 1;
        }
        if (action === "decrement") {
          return prev - 1;
        }
        return prev;
      });
    }
  });

  trpc.beep.numberOfBeepsSubscription.useSubscription(undefined, {
    onData(action) {
      utils.beep.beepsCount.setData(undefined, (prev) => {
        if (prev === undefined) {
          return;
        }
        if (action === "increment") {
          return prev + 1;
        }
        if (action === "decrement") {
          return prev - 1;
        }
        return prev;
      });
    }
  });

  return (
    <StatGroup gap={12} mt={8}>
      <Stat>
        <StatLabel>Users</StatLabel>
        <StatNumber>{userCount === undefined ? <Skeleton w="50px" height="32px" /> : userCount.toLocaleString()}</StatNumber>
      </Stat>
      <Stat>
        <StatLabel>Rides</StatLabel>
        <StatNumber>{beepCount === undefined ? <Skeleton w="50px" height="32px" /> : beepCount.toLocaleString()}</StatNumber>
      </Stat>
    </StatGroup>
  );
}
