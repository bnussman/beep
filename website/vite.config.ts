import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  ssr: {
    noExternal: ["@mui/*", "@toolpad/*"],
  },
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
      },
      sitemap: {
        enabled: true,
        host: "https://ridebeep.app",
      },
    }),
    react(),
    tailwindcss(),
  ],
});
