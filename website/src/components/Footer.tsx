import { Grid, Stack } from "@mui/material";
import React from "react";
import { FooterItem } from "./FooterItem";
import type { FooterItem as FooterItemType } from "./FooterItem.types";
import { BetterStackStatus } from "./BetterStackStatus";

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
      content: <BetterStackStatus />,
    }
  ];

  return (
    <Stack
      sx={(theme) => ({
        padding: 4,
        borderTop: 1,
        borderColor: `light-dark(${theme.palette.divider}, rgba(131, 131, 131, 0.1))`,
        backgroundColor: "light-dark(transparent, rgba(44, 44, 44, 0.1))",
      })}
    >
      <Grid
        container
        columnSpacing={4}
        rowSpacing={2}
        size={{ sm: 12 }}
        sx={{ alignItems: 'center' }}
      >
        {items.map((item, index) => (
          <Grid key={index}>
            <FooterItem item={item} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}