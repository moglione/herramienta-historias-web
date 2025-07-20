import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const isGhPages = process.env.APP_ENV === 'ghpages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    svgr({
      svgrOptions: {
        titleProp: true,
        svgo: true,
        memo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  convertColors: {
                    currentColor: /^(?!url|none)/i,
                  },
                },
              },
            },
            'removeDimensions',
          ],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  define: {
    SUB_ROUTE: JSON.stringify(isGhPages ? '/web-story-creation-tool' : '/'),
  },
  worker: {
    format: 'es',
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(
          __dirname,
          'packages/playground-story-editor/public/index.html'
        ),
        editor: path.resolve(
          __dirname,
          'packages/playground-story-editor/public/editor.html'
        ),
      },
    },
    outDir: 'build/playground',
  },
  server: {
    port: 8000,
  },
});
