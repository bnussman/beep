import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  ssr: {
    noExternal: ["@mui/*", "@toolpad/*"],
  },
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false,
      },
      // pages: [
      //   {
      //     path: "/",
      //     prerender: {
      //       outputPath: "/index.html",
      //       enabled: true,
      //       crawlLinks: false,
      //     },
      //   },
      //   {
      //     path: "/tools",
      //     prerender: {
      //       outputPath: "/tools.html",
      //       enabled: true,
      //       crawlLinks: false,
      //     },
      //   },
      //   {
      //     path: "/docs",
      //     prerender: {
      //       outputPath: "/docs.html",
      //       enabled: true,
      //       crawlLinks: true,
      //     },
      //   },
      // ],
      spa: {
        enabled: true,
        prerender: {
          outputPath: "/index.html",
          enabled: true,
          crawlLinks: false,
        },
      },
    }),
    react(),
    // babel({ presets: [reactCompilerPreset()] }),
  ],
});
