import { Box } from "@chakra-ui/react";

export function Card(props: { children: any }) {
    return (
        <Box
            boxShadow={'md'}
            rounded={'lg'}
            p={6}
        >
            {props.children}
        </Box>
    )
};
