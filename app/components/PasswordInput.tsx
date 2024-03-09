import React, { useState } from "react";
import { Button, InputProps, XStack, Input } from "@beep/ui";
import { Eye, EyeOff } from "@tamagui/lucide-icons";

interface Props extends InputProps {
  inputRef: any;
}

export function PasswordInput({ inputRef, ...props }: Props) {
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  return (
    <XStack gap="$2">
      <Input
        flexGrow={1}
        ref={inputRef}
        textContentType="password"
        secureTextEntry={!show}
        {...props}
      />
      <Button
        onPress={toggleShow}
        icon={show ? <Eye /> : <EyeOff />}
      />
    </XStack>
  );
}
