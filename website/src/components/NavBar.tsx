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
  Stack,
  Button,
  Image,
  Switch,
  useColorMode,
  Heading
} from '@chakra-ui/react';

export default function NavBar() {
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
    <Flex h={16} alignItems='center' justifyContent='space-between' px={4} mb={4}>
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
            colorScheme="brand"
            size="lg"
            ml={2}
          />
          <Box>🌑</Box>
        </HStack>
        <>
          {(user && user.role === UserRole.ADMIN) &&
            <AdminDropdown />
          }
          {user &&
            <UserDropdown />
          }
          {!user &&
            <>
              <Button
                as={Link}
                fontSize='sm'
                fontWeight={400}
                variant='link'
                to='/login'
              >
                Sign In
              </Button>
              <Button
                as={Link}
                fontSize='sm'
                fontWeight={600}
                color='white'
                bg='yellow.400'
                to='/signup'
                _hover={{
                  bg: 'yellow.300',
                }}>
                Sign Up
              </Button>
            </>
          }
        </>
      </HStack>
    </Flex>
  );
}
