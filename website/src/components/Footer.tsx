import React from "react";
import { FooterItem } from "./FooterItem";
import type { FooterItem as FooterItemType } from "./FooterItem.types";
import { BetterStackStatus } from "./BetterStackStatus";
import { ANDROID_DOWNLOAD_URL, IOS_DOWNLOAD_URL } from "../utils/utils";

export function Footer() {
  const items: FooterItemType[] = [
    {
      content: "Privacy Policy",
      href: "/privacy",
    },
    {
      content: "Terms of Service",
      href: "/terms",
    },
    {
      content: "iOS",
      href: IOS_DOWNLOAD_URL,
    },
    {
      content: "Android",
      href: ANDROID_DOWNLOAD_URL,
    },
    {
      content: <BetterStackStatus />,
    }
  ];

  return (
    <footer className="flex flex-col items-start gap-x-8 gap-y-4 border-t border-border/50 bg-background/10 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center">
      {items.map((item, index) => (
        <FooterItem item={item} key={index} />
      ))}
    </footer>
  );
}