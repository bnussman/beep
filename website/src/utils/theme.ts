import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  fonts: {
    heading: "poppins",
    body: "poppins",
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode(props.theme.semanticTokens.colors['chakra-body-bg']._light, 'rgb(14, 17, 19)')(props),
      },
    }),
  },
  components: {
    Table: {
      parts: ['th', 'td'],
      baseStyle: {
        th: {
          border: 'none !important',
        },
        td: {
          border: 'none !important',
        },
      },
    },
  },
});
