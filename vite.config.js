import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { env } from 'node:process'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: env.VITE_BASE_PATH ?? '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
