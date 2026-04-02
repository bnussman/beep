import * as MdxConfig from "./source.config";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";

export default defineConfig({
  ssr: {
    noExternal: ["@mui/*", "@toolpad/*"],
  },
  plugins: [
    mdx(MdxConfig),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    tailwindcss(),
    react(),
    // babel({ presets: [reactCompilerPreset()] }),
  ],
});
