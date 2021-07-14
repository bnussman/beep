import { Avatar, Box, Tooltip, Text, Center, useClipboard, useToast } from "@chakra-ui/react";
import React from "react";

interface Props {
  lat: number;
  lng: number;
  text?: string;
  photoUrl?: string | null;
}

export function Marker(props: Props) {
  const { lat, lng, photoUrl, text } = props;
  const { onCopy } = useClipboard(`${lat},${lng}`);
  const toast = useToast();

  const copy = () => {
    onCopy();
    toast({ title: "Copied coordinates to clipboard", status: "info" });
  };

  return (
    <Box width="max-content" onClick={copy}>
      <Tooltip label={`${lat}, ${lng}`} aria-label={`${lat}, ${lng}`}>
        <Box>
        <Center>
          <Avatar src={photoUrl || ''} size="xs" />
        </Center>
        <Text>{text}</Text>
        </Box>
      </Tooltip>
    </Box>
  );
};