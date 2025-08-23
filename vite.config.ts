import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  root: ".",
  publicDir: "public",
  build: {
    outDir: "docs", // GitHub Pages expects /docs for deployment
    assetsDir: "assets",
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
