import { Outputs } from "@/utils/orpc";

export function getCurrentStatusMessage(
  beep: Outputs["rider"]["currentRide"],
  car: Outputs["user"]["getUsersDefaultCar"] | undefined,
): string {
  switch (beep?.status) {
    case "waiting":
      return "Waiting for beeper to accept or deny you.";
    case "accepted":
      return "Beeper is getting ready to come get you. They will be on the way soon.";
    case "on_the_way":
      return "Beeper is on their way to get you.";
    case "here":
      if (car) {
        return `Beeper is here to pick you up in a ${car.color} ${car.make} ${car.model}.`;
      }
      return `Beeper is here to pick you up.`;
    case "in_progress":
      return "You are currently in the car with your beeper.";
    default:
      return "Unknown";
  }
}
