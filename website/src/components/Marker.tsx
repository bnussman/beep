import { Avatar } from "@chakra-ui/react";
import React from "react";

interface Props {
  lat: number;
  lng: number;
  text?: string;
  photoUrl?: string | null;
}

export function Marker(props: Props) {
  const { photoUrl } = props;

  return (
    <Avatar src={photoUrl || ''} size="xs" />
  );
};