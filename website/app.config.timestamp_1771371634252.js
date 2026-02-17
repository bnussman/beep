// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
var app_config_default = defineConfig({
  vite: {
    plugins: [
      TanStackRouterVite({
        routesDirectory: "./app/routes",
        generatedRouteTree: "./app/routeTree.gen.ts"
      }),
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"]
        }
      })
    ]
  }
});
export {
  app_config_default as default
};
