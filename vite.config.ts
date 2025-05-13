import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["cold-geese-unite.loca.lt","tangy-melons-fly.loca.lt"],
  },
});
