import React from 'react';

export interface ThemeContextData {
    theme: string;
    toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextData | null>(null);
