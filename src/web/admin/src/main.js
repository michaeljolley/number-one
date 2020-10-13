import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'


import { Auth0Plugin } from "@/plugins/auth/authPlugin";
import axios from '@/plugins/auth/authInterceptor'
import router from './router'
import store from "@/store";

Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  client_id: process.env.VUE_APP_AUTH0_CLIENTID,
  cacheLocation: 'localstorage',
  audience: 'https://GameDeckWut/',
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false

Vue.use(VueRouter)

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
