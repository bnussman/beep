import { Host, Image } from "@expo/ui/swift-ui";

export function LocationIcon() {
  return (
    <Host matchContents style={{ marginTop: 4 }}>
      <Image systemName="location.fill" size={18} />
    </Host>
  );
}
