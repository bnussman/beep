import React from 'react';

export function Heading1(props) {
    return (
        <h1 className="py-4 text-5xl font-bold text-gray-800 leading-7 dark:text-white">{props.children}</h1>
    )
}

export function Heading2(props) {
    return (
        <h2 className="py-3 text-4xl font-bold text-gray-800 leading-7 dark:text-white">{props.children}</h2>
    )
}

export function Heading3(props) {
    return (
        <h3 className="py-3 text-3xl font-bold text-gray-800 leading-7 dark:text-white">{props.children}</h3>
    )
}

export function Heading4(props) {
    return (
        <h4 className="py-1 text-2xl font-bold text-gray-800 leading-7 dark:text-white">{props.children}</h4>
    )
}

export function Heading5(props) {
    return (
        <h5 className="py-1 text-xl font-bold text-gray-800 leading-7 dark:text-white">{props.children}</h5>
    )
}

export function Heading6(props) {
    return (
        <h6 className="py-1 font-bold text-gray-800 text-l leading-7 dark:text-white">{props.children}</h6>
    )
}

export function Subtitle(props) {
    return (
        <p className="font-medium text-gray-800 dark:text-white">{props.children}</p>
    )
}

export function Body1(props) {
    return (
        <p className="text-gray-800 dark:text-white">{props.children}</p>
    )
}

export function Body2(props) {
    return (
        <p className="font-semibold text-gray-800 dark:text-white">{props.children}</p>
    )
}

export function Caption(props) {
    return (
        <p className={`text-xs font-medium text-gray-500 ${props.className}`}>{props.children}</p>
    )
}
