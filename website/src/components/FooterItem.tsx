import React from "react";
import { Link } from "./Link";
import type { FooterItemLink, FooterItem as FooterItemType } from "./FooterItem.types";

interface Props {
  item: FooterItemType | FooterItemLink;
}

export function FooterItem({ item }: Props) {
  if (item.href) {
    return <Link to={item.href}>{item.content}</Link>;
  }

  return item.content;
}