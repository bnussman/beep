import React, { ComponentProps } from "react";
import { Button, InputGroup } from "@heroui/react";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@phosphor-icons/react";

export function PasswordInput(props: ComponentProps<typeof InputGroup.Input>) {
  const [isVisible, setIsVisible] = useState(false);

  const Icon = isVisible ? EyeIcon : EyeSlashIcon;

  return (
    <InputGroup>
      <InputGroup.Prefix className="border-none">
        <KeyIcon weight="bold" />
      </InputGroup.Prefix>
      <InputGroup.Input type={isVisible ? "text" : "password"} {...props} />
      <InputGroup.Suffix className="pe-0 border-none">
        <Button
          isIconOnly
          aria-label={isVisible ? "Hide password" : "Show password"}
          size="sm"
          variant="ghost"
          onPress={() => setIsVisible(!isVisible)}
        >
          <Icon size={24} weight="bold" />
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  );
}