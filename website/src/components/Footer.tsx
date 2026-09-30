import { Grid, Stack } from "@mui/material";
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
    <Stack
      component="footer"
      sx={(theme) => ({
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
        rowGap: 2,
        columnGap: 4,
        paddingX: 4,
        paddingY: 2,
        borderTop: 1,
        borderColor: `light-dark(${theme.palette.divider}, rgba(131, 131, 131, 0.1))`,
        backgroundColor: "light-dark(transparent, rgba(44, 44, 44, 0.1))",
      })}
    >
      {items.map((item, index) => (
        <FooterItem item={item} key={index} />
      ))}
    </Stack>
  );
}