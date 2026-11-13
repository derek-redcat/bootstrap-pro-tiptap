/*
 * @Date: 2023-06-15 20:52:07
 * @LastEditors: yikoyu 2282373181@qq.com
 * @LastEditTime: 2023-06-15 22:46:19
 * @FilePath: \vuetify-pro-tiptap\vite-example.config.ts
 */
import { resolve } from 'node:path'
import process from 'node:process'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      // Use library source during development (stylesheets still come from lib/).
      // Set EXAMPLE_USE_LIB=1 to run the examples against the built lib/ instead.
      ...(process.env.EXAMPLE_USE_LIB
        ? []
        : [{ find: /^bootstrap-pro-tiptap$/, replacement: resolve(__dirname, 'src/index.ts') }]),
    ],
  },
})
