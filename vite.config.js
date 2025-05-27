import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// Vite configuration for React + SWC with custom output dir
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../backend/public',
        emptyOutDir: true
    }
})