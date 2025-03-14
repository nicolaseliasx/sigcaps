import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: "window",
  },
  plugins: [react()],
  build: {
    outDir: "build",
  },

  server: {
    port: 3001,
  },
});
