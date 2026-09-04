import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ["ai-study-assistant-client-nwqk.onrender.com"],
  },
});
