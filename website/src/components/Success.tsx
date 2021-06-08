import React from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';

interface Props {
    message: any;
}

export function Success(props: Props) {
    return (
        <Alert status="success" mb={4}>
            <AlertIcon />
            {props.message}
        </Alert>
    );
}
