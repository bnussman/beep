import {Alert, AlertIcon} from "@chakra-ui/react";

interface Props {
    error: any;
}

export function Error(props: Props) {
    return (
        <Alert status="error">
            <AlertIcon />
                {props.error.message}
        </Alert>
    );
}
