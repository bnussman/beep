import React from "react";
import { Typography } from "@heroui/react";
import type { FooterItem as FooterItemType } from "./FooterItem.types";
import { FooterItem } from "./FooterItem";

interface Props {
  title: string;
  items: FooterItemType[];
}

export function FooterLinkGroup({ title, items }: Props) {
  return (
    <div>
      <Typography type="body-sm" className="text-sm font-semibold text-foreground">
        {title}
      </Typography>
      <div className="mt-5 flex flex-col items-start gap-3">
        {items.map((item, index) => (
          <FooterItem item={item} key={index} />
        ))}
      </div>
    </div>
  );
}
