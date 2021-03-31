import { NavLink } from "react-router-dom";

export function Table(props) {
    return (
        <div className="overflow-auto">
            <table className="min-w-full overflow-x-scroll bg-white">
                {props.children}
            </table>
        </div>
    );
}

export function THead(props) {
    return (
        <thead className="bg-white dark:bg-gray-800">
            <tr>
                {props.children}
            </tr>
        </thead>
    );
}

export function TH(props) {
    return (
        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
            {props.children}
        </th>
    );
}

export function TBody(props) {
    return (
        <tbody className="overflow-x-scroll bg-white dark:bg-gray-800 dark:text-white">
            {props.children}
        </tbody>
    );
}

export function TR(props) {
    return <tr>{props.children}</tr>
}

export function TD(props) {
    return (
        <td className="px-6 py-4 dark:text-white">
            {props.children}
        </td>
    );
}

export function TDProfile(props) {
    return (
        <TD>
            <NavLink to={props.to || '#'} className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10">
                    <img className="w-10 h-10 rounded-full" src={props.photoUrl || 'https://i.imgur.com/IJVpfBXs.png'} alt={props.title} />
                </div>
                <div className="ml-4 dark:text-white">
                    <div className="text-sm font-medium">
                        {props.title}
                    </div>
                    <div className="text-sm">
                        {props.subtitle}
                    </div>
                </div>
            </NavLink>
        </TD>
    );
}

export function TDText(props) {
    return (
        <TD>
            <div className="text-sm text-gray-900 dark:text-white">{props.children}</div>
        </TD>
    )
}

export function TDButton(props) {
    return (
        <TD>
            <NavLink to={props.to || '/'} className="text-sm font-medium text-right whitespace-nowrap">
                {props.children}
            </NavLink>
        </TD>
    );
}
