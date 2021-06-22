import React from 'react';
import { Box } from "@chakra-ui/react";

export function Card(props: any) {
    return (
        <Box
            boxShadow={'md'}
            rounded={'lg'}
            p={6}
            {...props}
        >
            {props.children}
        </Box>
    )
};
