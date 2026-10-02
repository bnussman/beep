import React from "react";
import { useTheme } from "@heroui/react";

export function BetterStackStatus() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="pt-0.5">
      <iframe
        src={`https://status.ridebeep.app/badge?theme=${resolvedTheme ?? "light"}`}
        width="250"
        height="30"
        frameBorder="0"
        scrolling="no"
        title="Beep Status"
        style={{ colorScheme: "normal" }}
      />
    </div>
  )
}