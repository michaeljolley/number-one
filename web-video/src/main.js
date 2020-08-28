import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import { Auth0Plugin } from "@/plugins/auth/authPlugin";

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Auth0Plugin, {
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
    cacheLocation: 'localstorage',
    audience: 'https://NumberOne/',
    onRedirectCallback: (appState) => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      );
    }
  });

app.config.devtools = true;

app.mount('#app')

console.log(`VUE_APP_AUTH0_DOMAIN: ${process.env.VUE_APP_AUTH0_DOMAIN}`)
