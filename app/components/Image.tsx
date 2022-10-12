import { Box, IImageProps, Spinner, Image as _Image, Flex } from "native-base";
import React, { useState } from "react";

export function Image(props: IImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Box>
      {loading ? (
        <Flex
          w={props.w}
          h={props.h}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
        </Flex>
      ) : null}
      <_Image
        {...props}
        onLoadEnd={() => setLoading(false)}
        position={loading ? "absolute" : undefined}
      />
    </Box>
  );
}
