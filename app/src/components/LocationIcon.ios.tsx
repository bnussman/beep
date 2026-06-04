import { Host, Image } from "@expo/ui/swift-ui";

export function LocationIcon() {
  return (
    <Host matchContents>
      <Image systemName="location.fill" size={18} />
    </Host>
  );
}
