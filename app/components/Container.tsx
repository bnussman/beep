import React from "react";
import { Box, useColorModeValue, IBoxProps } from "native-base";

interface Props {
  children: any;
}

export const Container = (props: Props & IBoxProps): JSX.Element => {
  const { children, ...rest } = props;
  const bg = useColorModeValue("white", "black");

  return (
    <Box flex={1} bg={bg} {...rest}>
      {children}
    </Box>
  );
};
