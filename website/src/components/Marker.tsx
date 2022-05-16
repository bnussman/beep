import React from "react";
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
  lat: number;
  lng: number;
  text?: string;
  user?: User;
  variant?: 'queue' | 'default';
}

export function Marker(props: Props) {
  const { lat, lng, user, text, variant } = props;
  const { onCopy } = useClipboard(`${lat},${lng}`);
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
      <Popover isLazy>
        <PopoverTrigger>
          <Box width="max-content" cursor="pointer">
            <Center>
              <Avatar src={user?.photoUrl || ''} size="xs" />
            </Center>
            <Text color="black">{text}</Text>
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
            <PopoverFooter cursor="pointer" onClick={copy}>{lat.toFixed(3)} {lng.toFixed(3)}</PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  }

  return (
    <Box width="max-content" onClick={copy}>
      <Tooltip label={`${lat}, ${lng}`} aria-label={`${lat}, ${lng}`}>
        <Box>
          <Center>
            <Avatar src={user?.photoUrl || ''} size="xs" />
          </Center>
          <Text style={{ color: 'black' }}>{text}</Text>
        </Box>
      </Tooltip>
    </Box>
  );
};