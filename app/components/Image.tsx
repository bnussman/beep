import { useTheme } from "@/utils/theme";
import React, { useState } from "react";
import {
  ImageProps,
  Image as _Image,
  View,
  ActivityIndicator,
} from "react-native";

export function Image({ style, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  return (
    <>
      {loading && (
        <View
          style={[
            {
              display: "flex",
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(117, 117, 117, 0.47)',
            },
            style
          ]}
        >
          <ActivityIndicator />
        </View>
      )}
      <_Image
        onLoad={() => setLoading(false)}
        style={[
          loading && { position: 'absolute' },
          style,
        ]}
        {...props}
      />
    </>
  );
}
