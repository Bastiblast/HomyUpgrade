import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import monkey, { cdn, util } from 'vite-plugin-monkey';
import path from "path"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'



// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(),tailwindcss(),TanStackRouterVite({ target: 'react', autoCodeSplitting: true}),
   
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://bastiblast.github.io/monkeyWhiteBoard*'],
      },
      build: {
        externalGlobals: undefined,
      },
    }),
  ],
})
