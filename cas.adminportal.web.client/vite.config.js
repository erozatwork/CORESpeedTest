import { fileURLToPath, URL } from "node:url";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      injectRegister: false,

      includeAssets: [],
      pwaAssets: {
        disabled: true,
        config: false,
      },

      manifest: {
        name: "ADMIN PORTAL",
        short_name: "core",
        description: "core-agile-pwa-feature",
        theme_color: "#ffffff",
        icons: [
          {
            src: "vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "vite.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        swDest: "sw.js",
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },

      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  base: "/cas/adminportal/", // must match the URL path
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  build: {
    chunkSizeWarningLimit: 3000,
  },
  server: {
    // HANDOVER: Dev-only proxy to local API. Production builds use VITE_API_URL, not this proxy.
    proxy: {
      '/api': {
        target: 'https://localhost:7002',
        changeOrigin: true,
        secure: false, // allow self-signed cert on local .NET dev server
      },
    },
  },
});
