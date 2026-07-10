import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // .env-filerna ligger i repo-roten, inte i client/, se ../.env.development och ../.env.production
  envDir: path.resolve(__dirname, '..'),
})
