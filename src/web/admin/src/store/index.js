import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import chat from './modules/chat/store';

export default new Vuex.Store({
  modules: {
    chat,
  },
});
