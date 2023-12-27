import { Image as _Image, ImageProps, Spinner, Stack } from "tamagui";
import React, { useState } from "react";

export function Image(props: ImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Stack>
      {loading ? (
        <Stack
          w={props.w}
          h={props.h}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
        </Stack>
      ) : null}
      <_Image
        {...props}
        onLoadEnd={() => setLoading(false)}
        position={loading ? "absolute" : undefined}
      />
    </Stack>
  );
}
