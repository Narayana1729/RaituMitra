import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      // 🔑 ensures SW updates correctly
      registerType: "autoUpdate",

      // 🔑 build-time precaching (needed for Vite hashed assets)
      strategies: "generateSW",

      // 🔑 ensure SW controls whole app
      scope: "/",
      base: "/",

      // 🔑 include static assets
      includeAssets: [
        "favicon.ico",
        "icons/icon-192.png",
        "icons/icon-512.png",
      ],

      // 🔑 CRITICAL WORKBOX CONFIG
      workbox: {
        // Allow large React bundle to be cached
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

        // SPA fallback for React Router
        navigateFallback: "/index.html",

        // 🚨 ABSOLUTELY REQUIRED
        // Prevent serving index.html for JS/CSS/assets
        navigateFallbackDenylist: [
          /^\/assets\//,        // Vite hashed files
          /^\/registerSW\.js$/, // PWA helper
          /\.js$/,              // JS modules
          /\.css$/,             // CSS
          /\.json$/,            // manifest
          /\.png$/,
          /\.svg$/,
          /\.ico$/,
        ],
      },

      // 🔑 Web App Manifest
      manifest: {
        name: "Raitu Mitra",
        short_name: "RaituMitra",
        description: "Offline-first farming assistant for Indian farmers",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#16a34a",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("leaflet")) {
              return "vendor-leaflet";
            }
            if (id.includes("recharts") || id.includes("d3") || id.includes("resize-detector")) {
              return "vendor-charts";
            }
            if (id.includes("framer-motion") || id.includes("motion") || id.includes("gsap") || id.includes("aos")) {
              return "vendor-motion";
            }
            if (id.includes("firebase")) {
              return "vendor-firebase";
            }
            if (id.includes("lucide-react") || id.includes("react-feather")) {
              return "vendor-icons";
            }
            if (id.includes("onnxruntime-web")) {
              return "vendor-onnx";
            }
            if (id.includes("jspdf") || id.includes("html2canvas") || id.includes("file-saver")) {
              return "vendor-pdf";
            }
            if (id.includes("turf")) {
              return "vendor-turf";
            }
            if (id.includes("tsparticles") || id.includes("react-particles")) {
              return "vendor-particles";
            }
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-react";
            }
            if (id.includes("radix-ui")) {
              return "vendor-radix";
            }
            if (id.includes("i18next")) {
              return "vendor-i18n";
            }
            return "vendor-libs";
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});