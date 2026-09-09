import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// דמו סטטי בלבד: אין שרת, אין API. הכול נטען מהדפדפן.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
