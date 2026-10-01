import React from "react";
import { Link } from "./Link";
import type { FooterItemLink, FooterItem as FooterItemType } from "./FooterItem.types";

interface Props {
  item: FooterItemType | FooterItemLink;
}

export function FooterItem({ item }: Props) {
  if (item.href) {
    const isExternal = item.href.startsWith('http');

    return (
      <Link
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        to={item.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {item.content}
      </Link>
    );
  }

  return item.content;
}