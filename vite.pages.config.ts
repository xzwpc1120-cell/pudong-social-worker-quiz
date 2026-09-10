import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "pages-src",
  base: "/pudong-social-worker-quiz/",
  plugins: [react()],
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
});
