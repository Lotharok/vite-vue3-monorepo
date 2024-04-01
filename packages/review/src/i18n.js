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
