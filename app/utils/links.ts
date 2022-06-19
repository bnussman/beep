import { Linking, Platform } from "react-native";

export function openDirections(origin: string, dest: string): void {
  if (Platform.OS == "ios") {
    Linking.openURL(`http://maps.apple.com/?saddr=${origin}&daddr=${dest}`);
  } else {
    Linking.openURL(`https://www.google.com/maps/dir/${origin}/${dest}/`);
  }
}

export function openCashApp(
  username: string | null | undefined,
  groupSize: number,
  groupRate: number | undefined,
  singlesRate: number | undefined
) {
  if (!username || groupRate === undefined || singlesRate === undefined) {
    return;
  }

  if (groupSize > 1) {
    Linking.openURL(
      `https://cash.app/$${username}/${Number(groupSize) * groupRate}`
    );
  } else {
    Linking.openURL(`https://cash.app/$${username}/${singlesRate}`);
  }
}

export function openVenmo(
  username: string | null | undefined,
  groupSize: number,
  groupRate: number | undefined,
  singlesRate: number | undefined
) {
  if (!username || groupRate === undefined || singlesRate === undefined) {
    return;
  }

  if (groupSize > 1) {
    Linking.openURL(
      `venmo://paycharge?txn=pay&recipients=${username}&amount=${
        groupRate * groupSize
      }&note=Beep`
    );
  } else {
    Linking.openURL(
      `venmo://paycharge?txn=pay&recipients=${username}&amount=${singlesRate}&note=Beep`
    );
  }
}
