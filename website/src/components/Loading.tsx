import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

export default function Loading() {
    return (
        <Center h="100px">
            <Spinner size="xl" />
        </Center>
    );
}
