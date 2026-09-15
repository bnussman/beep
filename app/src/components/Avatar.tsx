import type { ImageProps } from "react-native";
import AvatarImage from "../../assets/avatar.png";
import { AvatarRootProps, Avatar as HeroAvatar } from "heroui-native";


interface Props extends AvatarRootProps {
  src: string | undefined;
}

export function Avatar(props: Props) {
  const { src, size = "md", ...rest } = props;

  return (
    <HeroAvatar size={size} {...rest}>
      <HeroAvatar.Image source={{ uri: src }} />
      <HeroAvatar.Fallback />
    </HeroAvatar>
  );
}
