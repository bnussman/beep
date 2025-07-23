import { useColorScheme } from "react-native";

export const lightTheme = {
  name: 'light',
  bg: {
    main: '#ffffff',
  },
  text: {
    primary: '#000000',
    subtle: '#1b1b1bff',
    error: '#DE595B',
  },
} as const;

export const darkTheme = {
  name: 'dark',
  bg: {
    main: '#000000',
  },
  text: {
    primary: '#FFFFFF',
    subtle: '#969696ff',
    error: '#DE595B',
  },
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;

export const useTheme = () => {
  const colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    return darkTheme;
  }

  return lightTheme;
};