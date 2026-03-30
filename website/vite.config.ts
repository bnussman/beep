import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  ssr: {
    noExternal: ["@mui/*", "@toolpad/*"],
  },
  plugins: [
    tanstackStart({}),
    react(),
    // babel({ presets: [reactCompilerPreset()] }),
  ],
});
