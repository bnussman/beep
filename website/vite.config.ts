import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    // babel({ presets: [reactCompilerPreset()] }),
  ],
});
