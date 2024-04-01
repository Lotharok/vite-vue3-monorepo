import path from "path";
import { defineConfig } from "vite";
import pluginVue from "@vitejs/plugin-vue";

const isExternal = (id) => !id.startsWith(".") && !path.isAbsolute(id);

export const getBaseConfig = ({ plugins = [], lib }) =>
   defineConfig(({ mode }) => {
      if (mode === "development") {
         return {
            plugins: [pluginVue(), ...plugins],
            build: {
               minify: false,
               lib,
               rollupOptions: {
                  external: isExternal,
                  output: {
                     globals: {
                        "styled-components": "styled",
                     },
                  },
               },
            },
         };
      } else {
         return {
            plugins: [pluginVue(), ...plugins],
            build: {
               lib,
               rollupOptions: {
                  external: isExternal,
                  output: {
                     globals: {
                        "styled-components": "styled",
                     },
                  },
               },
            },
         };
      }
   });
