import React from "react";
import { Chip } from "@heroui/react";
import { beepStatusToChipColorMap } from "../utils/utils";

interface Props {
  status: keyof typeof beepStatusToChipColorMap;
}

export function BeepStatusChip({ status }: Props) {
  return (
    <Chip
      color={beepStatusToChipColorMap[status]}
      className="capitalize whitespace-nowrap"
    >
      {status.replaceAll("_", " ")}
    </Chip>
  );
}