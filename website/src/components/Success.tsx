import { Alert, AlertIcon } from '@chakra-ui/react';

interface Props {
    message: any;
}

export function Success(props: Props) {
    return (
        <Alert status="success">
            <AlertIcon />
            {props.message}
        </Alert>
    );
}
