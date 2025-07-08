import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    base: '/fe-song-chord/', // 👈 add this if your repo is named chord-for-song
})
