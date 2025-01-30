import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [ vue() ],
  publicDir: false,
  build: {
    type: ['es', 'umd'],
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'vue3-pivottable',
      fileName: 'vue3-pivottable'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        }
      }
    }
  }
})
