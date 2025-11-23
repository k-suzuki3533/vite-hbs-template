// vite.config.mts
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import handlebars from 'vite-plugin-handlebars';
import { pageData } from './src/pageData';

const rootDir = resolve(__dirname, 'src/pages');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
  root: rootDir,
  base: '/',
  build: {
    outDir,
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
    rollupOptions: {
      input: {
        index: resolve(rootDir, 'index.html'),
        about: resolve(rootDir, 'about/index.html'),
        contact: resolve(rootDir, 'contact/index.html'),
      },
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: ({ name }) => {
          const n = name ?? '';
          if (/\.(css)$/.test(n)) return 'assets/css/[name][extname]';
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(n)) {
            return 'assets/images/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/components'),
      context(pagePath) {
        return pageData[pagePath as keyof typeof pageData] ?? {};
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      } as any,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
