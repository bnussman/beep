import { RouterOutput } from "@/utils/trpc";
import { Text } from "@/components/Text";
import { View } from "react-native";

interface Props {
  beep: RouterOutput["rider"]["currentRide"];
  car: RouterOutput["user"]["getUsersDefaultCar"] | undefined;
}

export function RideStatus({ beep, car }: Props) {
  if (!beep) {
    return null;
  }

  if (beep.status === "waiting") {
    const numberOfOtherRidersWaiting = beep.total_riders_waiting - 1;
    const ridersAhead =
      beep.riders_before_accepted + beep.riders_before_unaccepted;

    const status = beep.queue[0]
      ? getStatusOfBeepersCurrentRider(beep.queue[0].status)
      : null;

    return (
      <View>
        <Text>Waiting for beeper to accept or deny you</Text>
        {numberOfOtherRidersWaiting > 0 && (
          <Text color="subtle">
            {numberOfOtherRidersWaiting} other{" "}
            {numberOfOtherRidersWaiting === 1 ? "person" : "people"}{" "}
            {numberOfOtherRidersWaiting === 1 ? "is" : "are"} also waiting
          </Text>
        )}
        {ridersAhead > 0 && numberOfOtherRidersWaiting !== ridersAhead && (
          <Text color="subtle">
            {ridersAhead} {ridersAhead === 1 ? "person" : "people"}{" "}
            {ridersAhead === 1 ? "is" : "are"} ahead of you
          </Text>
        )}
        <Text color="subtle">{status}</Text>
      </View>
    );
  }

  if (beep.status === "accepted") {
    if (beep.riders_before_accepted === 0) {
      return (
        <Text>Beeper has accepted you. They will be on the way soon.</Text>
      );
    }

    const status = beep.queue[0]
      ? getStatusOfBeepersCurrentRider(beep.queue[0].status)
      : null;
    return (
      <View>
        <Text>
          {beep.beeper.first} has accepted you, but there{" "}
          {beep.riders_before_accepted === 1 ? "is" : "are"}{" "}
          {beep.riders_before_accepted}{" "}
          {beep.riders_before_accepted === 1 ? "rider" : "riders"} ahead of you.
        </Text>
        <Text color="subtle">{status}</Text>
      </View>
    );
  }

  if (beep.status === "on_the_way") {
    return <Text>Beeper is on their way to get you.</Text>;
  }

  if (beep.status === "here") {
    if (car) {
      return (
        <Text>
          Beeper is here to pick you up in a {car.color} {car.make} {car.model}.
        </Text>
      );
    }
    return <Text>Beeper is here to pick you up.</Text>;
  }

  if (beep.status === "in_progress") {
    return <Text>Your ride is in progress.</Text>;
  }

  return null;
}

function getStatusOfBeepersCurrentRider(
  status: NonNullable<RouterOutput["rider"]["currentRide"]>["status"],
) {
  switch (status) {
    case "accepted":
      return "They accepted their current rider and will be on the way to pick them up soon.";
    case "on_the_way":
      return "They are on their way to get their current rider.";
    case "here":
      return "They are picking up their current rider.";
    case "in_progress":
      return "They are driving their current rider.";
    default:
      return null;
  }
}
