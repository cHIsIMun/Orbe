import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuração para permitir iframe
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *",
    }
  },
  build: {
    // Garantir que os assets sejam carregados corretamente em diferentes contextos
    assetsDir: "assets",
    // Melhorar a segurança e compatibilidade para uso em iframes
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar dependências em chunks para melhor cache
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', '@radix-ui/react-slot'],
        },
      },
    },
  }
})