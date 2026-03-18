import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from '@rolldown/plugin-babel'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  ssr: {
    noExternal: ['@mui/*'],
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true
      },
    }),
    // tanstackRouter({ autoCodeSplitting: true }),
    react(),
    // babel({ presets: [reactCompilerPreset()] }),
  ],
});
