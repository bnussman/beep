import { RouterOutput } from "@/utils/trpc";

export function getCurrentStatusMessage(
  beep: RouterOutput["rider"]["currentRide"],
): string {
  switch (beep?.status) {
    case "waiting":
      return "Waiting for beeper to accept or deny you.";
    case "accepted":
      return "Beeper is getting ready to come get you. They will be on the way soon.";
    case "on_the_way":
      return "Beeper is on their way to get you.";
    case "here":
      return `Beeper is here to pick you up.`;
    case "in_progress":
      return "You are currently in the car with your beeper.";
    default:
      return "Unknown";
  }
}

export const statusToDescription: Record<RouterOutput['beep']['beep']['status'], string> = {
  canceled: "",
  denied: "",
  waiting: "",
  accepted: "",
  on_the_way: "They are on their way to their current rider.",
  here: "They are picking up their current rider.",
  in_progress: "They are taking their current rider to their destination.",
  complete: ""
};
