import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
    build: {
        outDir: '../backend/public',
        emptyOutDir: true
    }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// // Vite configuration for React + SWC with custom output dir
// export default defineConfig({
//     plugins: [react()],
//     build: {
//         outDir: '../backend/public',
//         emptyOutDir: true
//     }
// })