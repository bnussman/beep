import React from 'react';

export function Indicator(props) {
    return (
        <div className={`rounded-full bg-${props.color || 'green'}-500 h-3 shadow w-3 shadow inline-flex ${props.className}`}>
        </div>
    );
}

export function Badge(props) {
    return (
        <p className={`px-2 mx-1 inline-flex text-xs font-semibold rounded-full shadow bg-yellow-100 ${props.className}`}>
            {props.children}
        </p>
    )
}
