import React from "react";
import type { FooterItem as FooterItemType } from "./FooterItem.types";
import { BetterStackStatus } from "./BetterStackStatus";
import { ANDROID_DOWNLOAD_URL, IOS_DOWNLOAD_URL } from "../utils/utils";
import { Typography } from "@heroui/react";
import { FooterLinkGroup } from "./FooterGroup";
import { FacebookLogoIcon, GithubLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, SnapchatLogoIcon, TiktokLogoIcon, XLogoIcon } from "@phosphor-icons/react";

export function Footer() {
  const productItems: FooterItemType[] = [
    {
      content: "iOS",
      href: IOS_DOWNLOAD_URL,
    },
    {
      content: "Android",
      href: ANDROID_DOWNLOAD_URL,
    },
  ];

  const accountItems: FooterItemType[] = [
    {
      content: "Sign in",
      href: "/login",
    },
    {
      content: "Create account",
      href: "/signup",
    },
  ];

  const legalItems: FooterItemType[] = [
    {
      content: "Privacy Policy",
      href: "/privacy",
    },
    {
      content: "Terms of Service",
      href: "/terms",
    },
  ];

  return (
    <footer className="border-t border-border/50 bg-background/10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-12">
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">🚕</span>
              <Typography className="text-xl font-bold">Ride Beep App</Typography>
            </div>
            <Typography className="text-sm leading-6 text-muted-foreground">
              A rideshare app for students. Ride or drive at your university
              today.
            </Typography>
            <BetterStackStatus />
          </div>
          <FooterLinkGroup title="Product" items={productItems} />
          <FooterLinkGroup title="Account" items={accountItems} />
          <FooterLinkGroup title="Legal" items={legalItems} />
        </div>
        <div className="flex justify-between items-center flex-wrap-reverse gap-3 mt-12 border-t border-border/50 pt-6">
          <Typography className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ride Beep App
          </Typography>
          <div className="flex flex-row gap-4">
            <a href="https://github.com/bnussman/beep" target="_blank">
              <GithubLogoIcon size={20} />
            </a>
            <a href="https://twitter.com/ridebeepapp" target="_blank">
              <XLogoIcon size={20} />
            </a>
            <a href="https://linkedin.com/company/ride-beep-app" target="_blank">
              <LinkedinLogoIcon size={20} />
            </a>
            <a href="https://instagram.com/ridebeepapp" target="_blank">
              <InstagramLogoIcon size={20} />
            </a>
            <a href="https://facebook.com/ridebeepapp" target="_blank">
              <FacebookLogoIcon size={20} />
            </a>
            <a href="https://snapchat.com/@ridebeepapp" target="_blank">
              <SnapchatLogoIcon size={20} />
            </a>
            <a href="https://tiktok.com/@ridebeepapp" target="_blank">
              <TiktokLogoIcon size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
