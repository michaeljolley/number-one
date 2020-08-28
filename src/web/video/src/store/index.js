import { createStore } from 'vuex';

import * as ActionTypes from './action.types';
import * as MutationTypes from './mutation.types';

import userService from '@/services/userService';

export default createStore({
  state: {
    user: null
  },
  getters: {
    isAuthenticated: (currentState) => {
      return currentState.user !== null;
    }
  },
  mutations: {
    [MutationTypes.USER_SAVE](state, user) {
      state.user = user;
    },
    [MutationTypes.USER_CLEAR](state) {
      state.user = null;
    },
  },
  actions: {
    async [ActionTypes.USER_LOGIN](context, { name }) {
      const response = await userService.getUser(name);
      context.commit(MutationTypes.USER_SAVE, response.data);
    },
    [ActionTypes.USER_LOGOUT](context) {
      context.commit(MutationTypes.USER_CLEAR);
    }
  },
  modules: {
  }
})
