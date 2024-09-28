import React from 'react';
import { DownloadIcon } from '@chakra-ui/icons';
import { Link } from '@tanstack/react-router';
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react"
import { trpc } from '../utils/trpc';

interface Props {
  title: string;
  subtitle: string;
  image: any;
  buttonLink: string;
  buttonText: string;
}

export function Hero(props: Props) {
  const { title, subtitle, image, buttonText, buttonLink } = props;

  const { data: userCount } = trpc.user.userCount.useQuery();
  const { data: beepsCount } = trpc.beep.beepsCount.useQuery();

  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      minH="70vh"
      px={8}
      mb={16}
    >
      <Stack
        spacing={4}
        w={{ base: "80%", md: "40%" }}
        align={["center", "center", "flex-start", "flex-start"]}
      >
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          color="primary.800"
          textAlign={["center", "center", "left", "left"]}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="primary.800"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          {subtitle}
        </Heading>
        <Button
          as={Link}
          to={buttonLink}
          target="_blank"
          size="lg"
          rightIcon={<DownloadIcon />}
          colorScheme="yellow"
        >
          {buttonText}
        </Button>
        <StatGroup gap={8}>
          <Stat>
            <StatLabel>Users</StatLabel>
            <StatNumber>{userCount ?? 0}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Rides</StatLabel>
            <StatNumber>{beepsCount ?? 0}</StatNumber>
          </Stat>
        </StatGroup>
      </Stack>
      <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
        <Image maxH="800px" src={image} />
      </Box>
    </Flex>
  )
}
