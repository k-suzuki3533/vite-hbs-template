// src/types/vite-plugin-handlebars.d.ts
declare module 'vite-plugin-handlebars' {
  import type { Plugin } from 'vite';

  export interface VitePluginHandlebarsOptions {
    partialDirectory?: string | string[];
    context?: Record<string, unknown> | ((pagePath: string) => unknown);
  }

  export default function handlebars(options?: VitePluginHandlebarsOptions): Plugin;
}
