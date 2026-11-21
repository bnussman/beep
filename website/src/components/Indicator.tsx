import React from "react";
import { Tooltip } from "@heroui/react";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  color: string;
  tooltip?: string;
}

const colorClasses: Record<string, string> = {
  green: "bg-success",
  red: "bg-danger",
  yellow: "bg-warning",
  blue: "bg-accent",
  silver: "bg-gray-400",
  white: "bg-white outline outline-1 outline-border",
};

export function Indicator({ color, tooltip, className, style, ...rest }: Props) {
  const colorClass = colorClasses[color];

  const indicator = (
    <span
      className={`inline-block size-4 rounded-full ${colorClass ?? ""} ${className ?? ""}`}
      style={colorClass ? style : { backgroundColor: color, ...style }}
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
