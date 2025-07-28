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
      backgroundColor: '#ffffff',
      borderColor: '#f3f3f3ff',
    },
    button: {
      primary: {
        backgroundColor: '#f3f3f3ff',
        pressed: {
          backgroundColor: '#e7e7e7ff',
        },
      },
      secondary: {
        pressed: {
          backgroundColor: '#b9b9b944',
        },
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
      backgroundColor: '#1a1a1aff',
      borderColor: '#2c2c2cff',
    },
    button: {
      primary: {
        backgroundColor: '#292929ff',
        pressed: {
          backgroundColor: '#353535ff',
        },
      },
      secondary: {
        pressed: {
          backgroundColor: '#1f1f1f5b',
        },
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