import { useTheme } from "@/utils/theme";
import React, { useState } from "react";
import {
  ImageProps,
  Image as _Image,
  View,
  ActivityIndicator,
} from "react-native";
import { Card } from "./Card";

export function Image({ style, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  return (
    <>
      {loading && (
        <Card style={[style, { alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator />
        </Card>
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
