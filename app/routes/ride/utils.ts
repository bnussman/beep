import { RouterOutput } from "@/utils/trpc";

export function getCurrentStatusMessage(beep: RouterOutput['rider']['currentRide']): string {
  switch (beep?.status) {
    case 'waiting':
      return "Waiting for beeper to accept or deny you.";
    case 'accepted':
      return "Beeper is getting ready to come get you. They will be on the way soon.";
    case 'on_the_way':
      return "Beeper is on their way to get you.";
    case 'here':
      return `Beeper is here to pick you up in a ${beep.beeper.cars?.[0].color} ${beep.beeper.cars?.[0].make} ${beep.beeper.cars?.[0].model}`;
    case 'in_progress':
      return "You are currently in the car with your beeper.";
    default:
      return "Unknown";
  }
}
