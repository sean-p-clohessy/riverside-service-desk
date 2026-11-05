import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The repository name is confirmed against origin before deployment.
  base: "/riverside-service-desk/",
  build: { outDir: "dist" },
});
