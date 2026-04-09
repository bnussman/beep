import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  ssr: {
    noExternal: ["@mui/*", "@toolpad/*"],
  },
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          outputPath: '/index.html',
          enabled: true,
          crawlLinks: true,
          // autoSubfolderIndex: true,
        },
      },
      prerender: {
        enabled: true
      },
    }),
    react(),
    // babel({ presets: [reactCompilerPreset()] }),
  ],
});
