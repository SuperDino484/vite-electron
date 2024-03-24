import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: false,
    build: {
        emptyOutDir: false,
        ssr: "src-electron/electron.ts",
    }
})
