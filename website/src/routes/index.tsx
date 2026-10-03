import React from "react";
import iPhoneDark from "../assets/dark.webp?url";
import iPhoneLight from "../assets/light.webp?url";
import { getDownloadLink } from "../utils/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Typography } from "@heroui/react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex flex-1 items-center">
      <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Typography type="h1" className="text-center text-5xl font-bold lg:text-[3.8rem] md:text-left">
            Ride Beep App
          </Typography>
          <Typography type="body" className="text-center md:text-left">
            A rideshare app for students. Ride or drive at your university
            today.
          </Typography>
          <a href={getDownloadLink()} target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              Download
            </Button>
          </a>
        </div>
        <picture>
          <source srcSet={iPhoneLight} media="(prefers-color-scheme: light)" />
          <source srcSet={iPhoneDark} media="(prefers-color-scheme: dark)" />
          <img
            className="max-h-[min(max(80vh,500px),700px)] max-w-[calc(100vw-4rem)] object-contain"
            src={iPhoneLight}
            alt="iPhone Mockup of the Beep App"
            fetchPriority="high"
          />
        </picture>
      </div>
    </main>
  );
}
