import React from "react";
import { Link } from "./Link";
import type { FooterItemLink, FooterItem as FooterItemType } from "./FooterItem.types";
import { UndoRounded } from "@mui/icons-material";

interface Props {
  item: FooterItemType | FooterItemLink;
}

export function FooterItem({ item }: Props) {
  if (item.href) {
    const isExternal = item.href.startsWith('http');

    return (
      <Link to={item.href} target={isExternal ? "_blank" : undefined}>
        {item.content}
      </Link>
    );
  }

  return item.content;
}