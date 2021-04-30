import {Icon} from "@chakra-ui/react";

export function Indicator(props) {
    return (
        <Icon viewBox="0 0 200 200" color={`${props.color}.400`}>
            <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
        </Icon>
    );
}

export function Badge(props) {
    return (
        <p className={`px-2 mx-1 inline-flex text-xs font-semibold rounded-full shadow bg-gray-300 ${props.className}`}>
            {props.children}
        </p>
    )
}
