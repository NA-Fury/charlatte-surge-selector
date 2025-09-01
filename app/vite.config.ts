import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/charlatte-surge-selector/",
  plugins: [react()],
  server: { port: 5173 }
});
