# Vue3 + Lerna + Vite + mswjs

## Lerna Initial Setup

El Primer paso es configurar el proyecto de lerna, crear el folder del
proyecto y dentro del folder correr el siguiente comando:

```BASH
npx lerna init
```

Esto va a crear la estructua esencial para lerna, con los siguientes
archivos `lerna.json, package.json` y se debe de tener una carpeta vacia
llamada `packages` si no esta crearla.

Se debe modificar el archivo **lerna.json** debe de quedar similar a esto:

```JSON
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "packages": ["packages/*"],
  "npmClient": "yarn",
  "version": "independent"
}
```

## Vite Initial Setup

Una vez teniendo esto nos posicionamos en la carpeta `packages` y empezamos a crear
nuestros proyectos, para este ejemplo crearemos dos uno que se pueda exportar como libreria
y otro para poder utilizarlo.

Ejecutamos el siguiente comando:

```BASH
npx create-vite pt-common --template vue
```

Donde `pt-common` es el nombre de tu proyecto y `vue` indica que va a ser un proyecto de Vue3.

Esto nos va a crear la siguiente estructura:

```
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.vue
│   ├── assets
│   │   └── vue.svg
│   ├── index.css
│   └── main.js
└── vite.config.js
```

Para los proyectos que van a funcionar como librerias solo vamos a dejar la siguiente estructura:

```
├── package.json
├── src
│   ├── components
│   │   └── index.js
│   └── index.js
├── tsconfig.json
└── vite.config.js
```

<span id="packageConfigLib"></span>
La configuracion de las **dependencies** generales y las **devDependencies** se deben de bajar al `package.json`
que nos creo **lerna**, hay que modificar el `package.json` de los proyectos que sean librerias agregando la
siguiente seccion:

```JSON
"files": [
    "dist"
  ],
  "main": "./dist/pt-common.umd.js",
  "module": "./dist/pt-common.es.js",
  "exports": {
    ".": {
      "import": "./dist/pt-common.es.js",
      "require": "./dist/pt-common.umd.js"
    }
  },
```

lo cual va a indicar como va a ser exportado al momento de compilarlo.

Asi mismo editamos el script `dev`, para permitir generar el componente sin minificar en modo desarrollo.

```JSON
 "scripts": {
      "dev": "npm run lint & vite build --mode development",
      "build": "npm run lint & vite build",
      "lint": "eslint . --ext js,jsx,vue --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview",
      "storybook": "storybook dev -p 6006",
      "build-storybook": "storybook build"
   },
```

## Storybook Initial Setup

En los proyectos que van a funcionar como librerias de componentes vamos a instalar Storybook.
Ejecutamos el siguiente comando:

```BASH
npx storybook@latest init
```

Nos va a generar el folder `.storybook` con los archivos de configuracion y la carpeta `stories` en
`src`, la cual vamos a eliminar por que vamos a compilar nuestros propios componentes.

Posteriormente vamos a ejecutar el siguiente comando, para poder compilar con Vite los componentes:

```BASH
npx sb init --builder @storybook/builder-vite
```

Se deben de mover todas las dependencias que se hayan agregado al `package.json` global. Podemos
ejecutando simplemente con el comando `yarn storybook`.

La primera vez que vamos a habitar `storybook` en el proyecto general, debemos de ejecutar el comando:

```BASH
npx storybook@latest init
```

En la raiz del proyecto y vamos a modificar el archivo `.storybook\main.js` con lo siguiente:

```JS
stories: [
  "../packages/*/src/**/*..mdx",
  "../packages/*/src/**/*.stories.@(js|jsx|ts|tsx)"
],
```

Y vamos a remover del `package.json` global los scripts:

```JSON
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

## Global Setup

### Common Vite

Se debe de agregar un archivo `vite.config.js` en la raiz del proyecto lerna. Quedando de la siguiente forma:

```JS
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
```

<span id="viteConfigLib"></span>
Y dentro de los proyectos que estan en packages tenemos que modificar su archivo `vite.config.js` para
que herede del general, quedando de la siguiente manera:

```JS
import * as path from "path";
import { getBaseConfig } from "../../vite.config";

export default getBaseConfig({
  lib: {
    entry: path.resolve(__dirname, "src/index.js"),
    name: "PtCommon",
    formats: ["es", "umd"],
    fileName: (format) => `pt-common.${format}.js`,
  },
});
```

De igual forma para la configuracion de **ESLint** se debe de colocar el archivo `.eslintrc.cjs`
en la raiz del proyecto lerna, y en dado que existan en cada proyecto se deben de eliminar.

```JS
module.exports = {
   root: true,
   env: { browser: true, es2020: true },
   extends: [
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "prettier",
   ],
   ignorePatterns: ["dist", ".eslintrc.cjs"],
   parserOptions: { ecmaVersion: "latest", sourceType: "module" },
   settings: { react: { version: "18.2" } },
   plugins: [],
   rules: {
   },
};
```

### Common Storybook

Para cada proyecto de tipo libreria de componentes vamos a ejecutar los archivos dentro de
`.storybook`.

Para `main.js` quedaria de la siguiente manera:

```JS
import commonConfigs from "../../../.storybook/main";

const config = {
  ...commonConfigs,
  stories: ["../src/**/*..mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
};

export default config;
```

Para `preview.js` quedaria de la siguiente manera:

```JS
import preview from "../../../.storybook/preview";

export default preview;
```

Por ultimo agregamos el archivo `preview-head.html`.

```HTML
<script>
  window.global = window;
</script>
```

## Componentes JavaScript para uso general

Para poder agregar componentes o librerias para uso general nos posicionamos nuevamente en la
`packages` y creamos una nuevo proyecto con el siguiente comando:

```BASH
npx create-vite pt-common-js --template vanilla
```

Una vez creado el proyecto ejecutamos la [configuracion](#packageConfigLib) en el archivo `package.json`
y la [configuracion](#viteConfigLib).

De igual forma hay que eliminar los archivos que se han configurado de forma global como el `.gitignore`
y los archivos no necesarios como `index.html` o lo que esta en al carpeta `public`.

## Mock Api

Se va a utilizar mswjs para poder probar nuestro front sin necesidad del backend. Lo primero es instalar como
devDependencies `msw`, lo hacemos en el `package.json` global.

Una vez instalado el paquete ejecutamos proseguimos a configurar el worker de msw en la raiz de cada proyecto
del tipo demo, ejecutando el siguiente comando:

```BASH
npx msw init public
```

Lo siguiente seria configurar el mock service, crearemos una nueva carpeta llamada `mocks`, y dentro de esta dos carpetas mas
`data` donde estaran las respustas mockeadas y `handlers` donde se configurara los request intercepatados.

Vamos a agregar los siguientes archivos:

1. `./mocks/browser.js` el cual tendra la configuracion general del mock service.

```JS
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers/index.js";

export const worker = setupWorker(...handlers);
```

2. `./handlers/index.js` el cual tendra el exportado de todos los servicios a mockear

```JS
import { service1 } from "./service1.js";
import { service2 } from "./service2.js";

export const handlers = [...service1, ...service2];
```

3. `./handlers/serviceXX.js` es la definicion del servicio a mockear [Documentacion](https://mswjs.io/docs/basics/intercepting-requests)

```JS
import { http, HttpResponse } from "msw";
import { jsonActivities } from "../data/activities.js";

export const service1 = [
   http.get("https://activity.com.mx/v2/rates", () => {
      return HttpResponse.json(jsonActivities);
   }),
];
```

4. `./data/XXX.js` seria los datos que van a regresar los servicios mockeados.

```JS
export const jsonActivities = [
   {
      id: 1,
      uri: "uri-ejemplo",
      name: "Catamarán a Isla Mujeres con barra libre y snorkel",
   },
];
```

Al final vamos a tener una estructura similar:

```
├── .storybook
├── mocks
│   ├── data
│   │   └── data1.js
│   ├── handlers
│   │   ├── service1.js
│   │   └── index.js
│   └── browser.js
├── packages
├── .eslintrc.cjs
├── .gitignore
├── lerna.json
├── package.json
└── vite.config.js
```

Por ultimo para configurar nuestra aplicacion para ocupar el mock tenemos que modificar el archivo
`main.js` de nuestro proyecto. Se coloca el timeout para dejar que cargue el worker antes de iniciar
la aplicacion de Vue.

```JS
const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
const app = createApp(App);
if (useMocks) {
   const { worker } = await import("../../../mocks/browser.js");
   worker.start({
      onUnhandledRequest: 'bypass',
    });
   setTimeout(() => {
      app.mount("#app");
   }, "1000");
} else {
   app.mount("#app");
}
```

## Internationalization con i18next

Para manejar diferentes idiomas de nuestra aplicacion vamos a utilizar [i18next-vue](https://github.com/i18next/i18next-vue).
Vamos a instalar lo siguiente;

```BASH
yarn add i18next-vue
yarn add i18next
yarn add i18next-http-backend
```

Una vez instalado esto, creamos el archivo `i18n.js` junto a nuestro `main.js` minimo con el siguiente contenido:

```JS
import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import Backend from 'i18next-http-backend'

i18next
.use(Backend)
.init({
   debug: true,
   fallbackLng: "es-mx",
   load: "currentOnly",
   interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
   },
   backend: {
      loadPath: (lng, ns) => {
         return `/locales/${lng}/${ns}.json`;
         //return ` https://your.cloudfront.net/i18n/addons/${lng}/${ns}.json`;
      },
      crossDomain: true,
   },
 });

export default function (app) {
   app.use(I18NextVue, { i18next })
   return app
 }
```

La configuracion de `backend` nos permite tener los archivos locales o bien en algun cdn publico,
para desarrollo, es conveniente manejarlos locales y una vez que se sube a produccion manejarlos desde una cdn.

Los archivos para configurar las traducciones son de tipo `JSON` y debe de quedar en una estructura de carpetas
como la siguiente:

```
└── public
    └── locales
        ├── es-MX
        │   └── translation.json
        ├── es-CO
        │   └── translation.json
        └── en-US
            └── translation.json
```

Para poder empezar a utilizar el servicio hay que importar el archivo `i18n.js` y ajustar la incializacion de la
aplicacion en nuestro `main.js` de la siguiente forma:

```JS
import { createApp } from "vue";
import i18n from './i18n'
import "./style.css";
import App from "./App.vue";

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
const app = i18n(createApp(App));
if (useMocks) {
   const { worker } = await import("../../../mocks/browser.js");
   worker.start();
   setTimeout(() => {
      app.mount("#app");
   }, "1000");
} else {
   app.mount("#app");
}
```

Por ultimo para ya utilizarlo en nuestros componentes quedaria de la siguiente manera:

```JSX
...
<template>
   <div>
      <h1>{{ $t("review_package.title") }}</h1>
      <div v-if="loading" class="loading">Aqui va mi skeleton...</div>
      <div v-else>
         <DetailHotel :title="respackage.HotelName"></DetailHotel>
      </div>
   </div>
</template>
...
```
