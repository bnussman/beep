import { cx } from "class-variance-authority";
import React, { useState } from "react";
import {
  ImageProps,
  Image as _Image,
  View,
  ActivityIndicator,
} from "react-native";

export function Image(props: ImageProps) {
  const { className, ...rest } = props;
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <View
          className={cx(
            ["bg-neutral-100 dark:bg-neutral-800 justify-center"],
            className,
          )}
        >
          <ActivityIndicator />
        </View>
      )}
      <_Image
        onLoad={() => setLoading(false)}
        className={cx({ ["absolute"]: loading }, className)}
        {...rest}
      />
    </>
  );
}
