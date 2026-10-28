import { defineConfig, loadEnv } from 'vite'
import { createGithubHandler } from './server/github.mjs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return {
  plugins: [
    {
      name: 'vibebud-github-api',
      configureServer(server) { server.middlewares.use(createGithubHandler({ ...env, NODE_ENV: 'development' })) },
      configurePreviewServer(server) { server.middlewares.use(createGithubHandler({ ...env, NODE_ENV: 'development' })) },
    },
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'VibeBud',
        short_name: 'VibeBud',
        description: 'Continue e conclua seus projetos.',
        theme_color: '#0B0B0C',
        background_color: '#0B0B0C',
        display: 'standalone',
        start_url: '/app',
        icons: [
          { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
  }
})
