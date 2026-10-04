import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type ProxyOptions } from "vite";

const currencyBeaconProxy: Record<string, ProxyOptions> = {
  "/currencybeacon": {
    target: "https://api.currencybeacon.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/currencybeacon/, ""),
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: currencyBeaconProxy },
  preview: { proxy: currencyBeaconProxy },
});
