import React from 'react';
import { NavLink } from "react-router-dom";

export function Nav(props) {

    // Pass direction prop to children
    const children = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                direction: props.direction
            });
        }
        return child;
    });

    return (
        <ul
            className={`pl-4 flex flex-row flex-${props.direction || 'row'} ${props.className}`}>
            {children}
        </ul>
    )
}

export function NavItem(props) {
    return (
        <li className={`${props.direction === 'col' ? 'py-2' : 'px-2'} mr-3 flex items-center`}>
            { props.to
                ?
                // Navigation link
                <NavLink
                    to={props.to}
                    onClick={props.onClick}
                    className={`hover:text-yellow-300 ${props.className}`}
                    activeClassName="font-semibold text-yellow-400">
                    {props.children}
                </NavLink>
                :
                // Button with action
                <button
                    onClick={props.onClick}
                    className={`hover:text-yellow-500 focus:outline-none ${props.className}`}>
                    {props.children}
                </button>
            }
        </li>
    )
}
