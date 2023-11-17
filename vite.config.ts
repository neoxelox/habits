import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

import cssnano from "cssnano";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: "**/*",
      includeManifestIcons: true,
      manifest: {
        id: "sh.arn.habits",
        name: "Habits",
        short_name: "Habits",
        description: "A simple habit tracking app",
        theme_color: "#18181b",
        background_color: "#000000",
        orientation: "portrait",
        icons: [
          {
            src: "/icon-100x100.png",
            sizes: "100x100",
            type: "image/png",
          },
          {
            src: "/icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-1024x1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss({ config: ".tailwindrc.cjs" }), autoprefixer(), cssnano()],
    },
  },
});
