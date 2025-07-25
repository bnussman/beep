import { useColorScheme } from "react-native";

export const lightTheme = {
  name: 'light',
  bg: {
    main: '#ffffff',
  },
  components: {
    input: {
      borderColor: '#f3f3f3ff',
      backgroundColor: '#fcfcfc88',
    },
    card: {
      bg: '#ffffff',
      borderColor: '#f3f3f3ff',
    },
    button: {
      primary: {
        bg: '#f0f0f0ff',
      },
    },
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
  components: {
    input: {
      borderColor: '#2c2c2cff',
      backgroundColor: '#1a1a1aff',
    },
    card: {
      bg: '#1a1a1aff',
      borderColor: '#2c2c2cff',
    },
    button: {
      primary: {
        bg: '#202020ff',
      },
    },
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