import React from 'react';
import Logo from '../assets/icon.png';
import { Link } from "react-router-dom";
import { UserDropdown } from './UserDropdown';
import { AdminDropdown } from './AdminDropdown';
import { UserRole } from '../types/User';
import { useQuery } from '@apollo/client';
import { GetUserDataQuery } from '../generated/graphql';
import { GetUserData } from '../App';
import {
  Box,
  Flex,
  HStack,
  Button,
  Image,
  Switch,
  useColorMode,
  Heading
} from '@chakra-ui/react';

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data } = useQuery<GetUserDataQuery>(GetUserData);

  const user = data?.getUser;

  const Icon = () => (
    <Flex
      as={Link}
      to="/"
      backgroundColor='white'
      alignItems='center'
      justifyContent='center'
      borderRadius='xl'
      boxShadow="dark-lg"
      width={10}
      height={10}
    >
      <Image h={8} src={Logo} />
    </Flex>
  );

  return (
    <Flex h={16} alignItems='center' justifyContent='space-between' px={4} mb={2}>
      <HStack spacing={4} alignItems='center'>
        <Icon />
        <Heading
          as={Link}
          to="/"
          size="md"
          fontWeight="bold"
          bgGradient='linear(to-l, #fb7ba2, #fce043)'
          bgClip='text'
          textAlign={["center", "center", "left", "left"]}
          display={{ base: 'none', md: "unset" }}
        >
          Ride Beep App
        </Heading>
      </HStack>
      <HStack spacing={4}>
        <HStack spacing={4} mr={4}>
          <Box>☀️</Box>
          <Switch
            isChecked={colorMode === "dark"}
            onChange={toggleColorMode}
            colorScheme="black"
            size="lg"
            ml={2}
          />
          <Box>🌑</Box>
        </HStack>
        <>
          {(user && user.role === UserRole.ADMIN) && <AdminDropdown />}
          {user && <UserDropdown />}
          {!user &&
            <>
              <Button
                as={Link}
                to='/login'
              >
                Login
              </Button>
              <Button
                as={Link}
                to='/signup'
                textColor="white"
                bgGradient='linear(to-r, #fb7ba2, #fce043)'
                boxShadow="0 0 15px 2px #fb7ba2"
                _hover={{
                  bgGradient: 'linear(to-r, pink.200, yellow.200)',
                }}
                _active={{
                  bgGradient: 'linear(to-r, pink.300, yellow.400)',
                }}
              >
                Sign Up
              </Button>
            </>
          }
        </>
      </HStack>
    </Flex>
  );
}