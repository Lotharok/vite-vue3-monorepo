import { createApp } from "vue";
import i18n from './i18n'
import "./style.css";
import App from "./App.vue";

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
const app = i18n(createApp(App));
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
