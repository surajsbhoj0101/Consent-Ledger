import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss({
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            roboto: ['Roboto', 'sans-serif'],
          }
        }
      }
    }
  })
  ],
  base: "/",
  define: {
    global: "globalThis",
  },
});