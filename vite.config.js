import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/another-habit-tracker/',
  plugins: [react()],
  server: {
    watch: {
      ignored: ['!**/src/**', '!**/index.html', '!**/public/**'],
    },
  },
})
