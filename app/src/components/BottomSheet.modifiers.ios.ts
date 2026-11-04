import {
  interactiveDismissDisabled,
  presentationBackgroundInteraction,
} from "@expo/ui/swift-ui/modifiers";

// Keep the map behind the sheet interactive while allowing swipe-to-dismiss
export const sheetModifiers = [
  presentationBackgroundInteraction("enabled"),
  interactiveDismissDisabled(false),
];
