import axios from 'axios';
import Vue from 'vue';
import { getInstance } from './authPlugin';

axios.interceptors.request.use(
  async (config) => {
    const authService = getInstance();
    const token = await authService.getTokenSilently();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
);

axios.interceptors.response.use(
  (response) => {
    if (response.status == 401) {
      const authService = getInstance();
      authService.logout();
      Vue.$router.push('/');
    }
    return response;
  },
  (error) => Promise.reject(error),
);

export default axios;