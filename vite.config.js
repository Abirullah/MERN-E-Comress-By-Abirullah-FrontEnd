import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mern-e-comress-by-abirullah-backend.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
