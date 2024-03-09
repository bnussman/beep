import React, { useState } from "react";
import { Image as _Image, ImageProps, Spinner, Stack } from "@beep/ui";

export function Image(props: ImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Stack>
      {loading && (
        <Stack
          w={props.w ?? props.width}
          h={props.h ?? props.height}
          borderRadius={props.borderRadius}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$gray4"
        >
          <Spinner />
        </Stack>
      )}
      <_Image
        {...props}
        onLoad={() => setLoading(false)}
        position={loading ? "absolute" : undefined}
      />
    </Stack>
  );
}
