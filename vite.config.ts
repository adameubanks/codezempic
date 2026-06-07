import { resolve } from 'path'
import { defineConfig } from 'vite'

const babelEnvDefines = {
  'process.env.BABEL_TYPES_8_BREAKING': 'false',
  'process.env.BABEL_8_BREAKING': 'false',
}

export default defineConfig({
  base: '/codezempic/',
  define: babelEnvDefines,
  optimizeDeps: {
    esbuildOptions: { define: babelEnvDefines },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
      },
    },
  },
})
