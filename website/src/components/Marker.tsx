import React from "react";
import { Marker as _Marker } from 'react-map-gl';
import { User } from "../generated/graphql";
import { Link } from "react-router-dom";
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
  Tooltip
} from "@chakra-ui/react";

interface Props {
  latitude: number;
  longitude: number;
  user: User;
  variant?: 'queue' | 'default';
}

export function Marker(props: Props) {
  const { latitude, longitude, user, variant } = props;
  const { onCopy } = useClipboard(`${latitude},${longitude}`);
  const toast = useToast();

  const copy = () => {
    onCopy();
    toast({ title: "Copied coordinates to clipboard", status: "info" });
  };

  if (!user) {
    return null;
  }

  if (variant === 'queue') {
    return (
      <_Marker longitude={longitude} latitude={latitude}>
        <Popover isLazy>
          <PopoverTrigger>
            <Box width="max-content" cursor="pointer">
              <Center>
                <Avatar src={user?.photoUrl || ''} size="xs" />
              </Center>
              <Text>{user.name}</Text>
            </Box>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>
                <Link to={`/admin/users/${user?.id}/queue`}>
                  <HStack>
                    <Avatar src={user?.photoUrl || ''} />
                    <Stack spacing={0}>
                      <Text fontWeight="extrabold">{user?.name}</Text>
                      <Text>@{user?.username}</Text>
                    </Stack>
                  </HStack>
                </Link>
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <QueuePreview user={user} />
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
              <Avatar src={user?.photoUrl || ''} size="xs" />
            </Center>
            <Text>{user.name}</Text>
          </Box>
        </Tooltip>
      </Box>
    </_Marker>
  );
};