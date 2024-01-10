import React from "react";
import { Marker as _Marker } from 'react-map-gl';
import { QueuePreview } from "./QueuePreview";
import {
  Avatar,
  Box,
  Text,
  Center,
  useClipboard,
  useToast,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  HStack,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

interface Props {
  latitude: number;
  longitude: number;
  username: string;
  userId: string;
  photo: string | null | undefined;
  name: string;
  variant?: 'queue' | 'default';
}

export function Marker(props: Props) {
  const { latitude, longitude, variant, userId, username, photo, name } = props;
  const { onCopy } = useClipboard(`${latitude},${longitude}`);
  const toast = useToast();

  const copy = () => {
    onCopy();
    toast({ title: "Copied coordinates to clipboard", status: "info" });
  };

  if (variant === 'queue') {
    return (
      <_Marker longitude={longitude} latitude={latitude}>
        <Popover isLazy>
          <PopoverTrigger>
            <Box width="max-content" cursor="pointer">
              <Center>
                <Avatar src={photo || ''} size="xs" />
              </Center>
              <Text>{name}</Text>
            </Box>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>
                <Link to="/admin/users/$userId/queue" params={{ userId }}>
                  <HStack>
                    <Avatar src={photo || ''} />
                    <Stack spacing={0}>
                      <Text fontWeight="extrabold">{name}</Text>
                      <Text>@{username}</Text>
                    </Stack>
                  </HStack>
                </Link>
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <QueuePreview userId={userId} />
              </PopoverBody>
              <PopoverFooter cursor="pointer" onClick={copy}>{latitude.toFixed(3)} {longitude.toFixed(3)}</PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </_Marker>
    );
  }

  return (
    <_Marker latitude={latitude} longitude={longitude}>
      <Box width="max-content" onClick={copy}>
        <Tooltip label={`${latitude}, ${longitude}`} aria-label={`${latitude}, ${longitude}`}>
          <Box>
            <Center>
              <Avatar src={photo || ''} size="xs" />
            </Center>
            <Text>{name}</Text>
          </Box>
        </Tooltip>
      </Box>
    </_Marker>
  );
};