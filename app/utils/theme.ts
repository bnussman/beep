import { useColorScheme } from "react-native";

export const lightTheme = {
  name: "light",
  bg: {
    main: "#ffffff",
  },
  components: {
    input: {
      borderColor: "#f3f3f3ff",
      backgroundColor: "#fcfcfc88",
    },
    card: {
      backgroundColor: "#ffffff",
      borderColor: "#f3f3f3ff",
    },
    button: {
      primary: {
        backgroundColor: "#f3f3f3ff",
        pressed: {
          backgroundColor: "#e7e7e7ff",
        },
      },
      secondary: {
        pressed: {
          backgroundColor: "#b9b9b944",
        },
      },
      red: {
        backgroundColor: "rgba(204, 93, 105, 0.2)",
        borderColor: "rgba(255, 80, 80, 0.5)",
        pressed: {
          backgroundColor: "rgba(255, 0, 0, 0.5)",
        },
      },
      green: {
        backgroundColor: "rgba(38, 88, 82, 0.2)",
        borderColor: "rgba(76, 175, 80, 0.5)",
        pressed: {
          backgroundColor: "rgba(76, 175, 80, 0.5)",
        },
      },
    },
  },
  text: {
    primary: "#000000",
    subtle: "#1b1b1bff",
    error: "#DE595B",
  },
} as const;

export const darkTheme = {
  name: "dark",
  bg: {
    main: "#000000",
  },
  components: {
    input: {
      borderColor: "#2c2c2cff",
      backgroundColor: "#1a1a1aff",
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.07)",
      borderColor: "#2c2c2cff",
    },
    button: {
      primary: {
        backgroundColor: "rgba(55, 55, 55, 0.5)",
        pressed: {
          backgroundColor: "#353535ff",
        },
      },
      secondary: {
        pressed: {
          backgroundColor: "#1f1f1f5b",
        },
      },
      red: {
        backgroundColor: "rgba(204, 93, 105, 0.2)",
        borderColor: "rgba(255, 80, 80, 0.5)",
        pressed: {
          backgroundColor: "rgba(204, 93, 105, 0.4)",
        },
      },
      green: {
        backgroundColor: "rgba(38, 88, 82, 0.2)",
        borderColor: "rgba(76, 175, 80, 0.5)",
        pressed: {
          backgroundColor: "rgba(38, 88, 82, 0.4)",
        },
      },
    },
  },
  text: {
    primary: "#FFFFFF",
    subtle: "#969696ff",
    error: "#DE595B",
  },
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;

export const useTheme = () => {
  const colorScheme = useColorScheme();

  if (colorScheme === "dark") {
    return darkTheme;
  }

  return lightTheme;
};
