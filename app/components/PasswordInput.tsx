import React, { useState } from "react";
import { InputProps, Input } from "tamagui";

interface Props extends InputProps {
  inputRef: any;
}

export function PasswordInput({ inputRef, ...props }: Props) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  return (
    <Input
      {...props}
      secureTextEntry={!show}
      ref={inputRef}
    />
  );
}
