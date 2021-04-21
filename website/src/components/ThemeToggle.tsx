import React from "react"
import {ThemeContext} from "../ThemeContext"
import { Switch } from '@headlessui/react'

export const ThemeToggle = () => {
    const { theme, setTheme } = React.useContext(ThemeContext);

    function handleChange() {
        if (theme === "dark") setTheme("light");
        else setTheme("dark");
    }

    return (
        <Switch.Group as="div" className="flex items-center space-x-4">
            <Switch
                as="button"
                checked={theme === "dark"}
                onChange={handleChange}
                className={`${
                    theme==="dark" ? "bg-yellow-400" : "bg-gray-200"
                } relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline`}
            >
                {({ checked }) => (
                    <span
                        className={`${
                            checked ? "translate-x-5" : "translate-x-0"
                        } inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full`}
                    />
                )}
            </Switch>
        </Switch.Group>
    );
}
