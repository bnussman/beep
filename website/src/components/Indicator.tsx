import React from "react";
import { Tooltip } from "@heroui/react";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  color: string;
  tooltip?: string;
}

const colorMap: Record<string, string> = {
  green: "#81c784",
  red: "#e57373",
  yellow: "#ffb74d",
  blue: "#64b5f6",
  silver: "gray",
};

export function Indicator({ color, tooltip, className, style, ...rest }: Props) {
  const indicator = (
    <span
      className={`inline-block size-4 rounded-full ${className ?? ""}`}
      style={{
        backgroundColor: colorMap[color] ?? color,
        ...(color === "white" ? { outline: "1px solid currentColor" } : {}),
        ...style,
      }}
      {...rest}
    />
  );

  if (tooltip) {
    return <Tooltip>
      <Tooltip.Trigger>{indicator}</Tooltip.Trigger>
      <Tooltip.Content showArrow>{tooltip}</Tooltip.Content>
    </Tooltip>;
  }

  return indicator;
}
