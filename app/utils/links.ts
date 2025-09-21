import { captureException } from "@sentry/react-native";
import { Linking, Platform, Share } from "react-native";

export function openDirections(origin: string, dest: string): void {
  if (Platform.OS == "ios") {
    Linking.openURL(`http://maps.apple.com/?saddr=${origin}&daddr=${dest}`);
  } else {
    Linking.openURL(`https://www.google.com/maps/dir/${origin}/${dest}/`);
  }
}

export function getCashAppLink(
  username: string,
  groupSize: number,
  groupRate: number,
  singlesRate: number,
) {
  if (groupSize > 1) {
    return `https://cash.app/$${username}/${Number(groupSize) * groupRate}`;
  } else {
    return `https://cash.app/$${username}/${singlesRate}`;
  }
}

export function openCashApp(
  username: string | null | undefined,
  groupSize: number,
  groupRate: number | undefined,
  singlesRate: number | undefined,
) {
  if (!username || groupRate === undefined || singlesRate === undefined) {
    return;
  }

  Linking.openURL(getCashAppLink(username, groupSize, groupRate, singlesRate));
}

export function getVenmoLink(
  username: string,
  groupSize: number,
  groupRate: number,
  singlesRate: number,
  transaction: "pay" | "charge",
) {
  if (groupSize > 1) {
    return `venmo://paycharge?txn=${transaction}&recipients=${username}&amount=${
      groupRate * groupSize
    }&note=Beep`;
  } else {
    return `venmo://paycharge?txn=${transaction}&recipients=${username}&amount=${singlesRate}&note=Beep`;
  }
}

export function openVenmo(
  username: string | null | undefined,
  groupSize: number,
  groupRate: number | undefined,
  singlesRate: number | undefined,
  transaction: "pay" | "charge",
) {
  if (!username || groupRate === undefined || singlesRate === undefined) {
    return;
  }

  Linking.openURL(
    getVenmoLink(username, groupSize, groupRate, singlesRate, transaction),
  );
}

export function shareVenmoInformation(
  venmo: string | null | undefined,
  groupSize: number,
  groupRate: number,
  singlesRate: number,
): void {
  if (!venmo) {
    alert("User does not have a Venmo username setup.");
    return;
  }

  try {
    Share.share({
      message: `Please Venmo ${venmo} $${groupRate} for the beep!`,
      url: getVenmoLink(venmo, groupSize, groupRate, singlesRate, "pay"),
    });
  } catch (error) {
    captureException(error);
    console.error(error);
    alert("Unable to open share. Sorry!");
  }
}

export function getRawPhoneNumber(phone: string | null | undefined) {
  if (!phone) {
    return null;
  }
  return phone.replace(/\D/g, "");
}
