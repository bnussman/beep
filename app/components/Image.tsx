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

  return (
    <Card style={[style, { padding: 0 }]}>
      {loading && (
        <View
          style={{
            position: "relative",
            zIndex: 100,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
      <_Image
        style={[style, { position: "absolute" }]}
        onLoad={() => setLoading(false)}
        {...props}
      />
    </Card>
  );
}
