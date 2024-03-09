import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

export function Text(props: SizableTextProps) {
  if (props.children === null || props.children === undefined) {
    return null;
  }

  if (Array.isArray(props.children) && props.children.every(child => !child)) {
    return null;
  }
  return <SizableText {...props} />;
}
