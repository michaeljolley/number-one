import createAuth0Client from '@auth0/auth0-spa-js';
import * as ActionTypes from '@/store/action.types';
import store from '@/store';

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

let instance;

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export class useAuth0 {

  options = {};
  loading = true;
  isAuthenticated = false;
  user = {};
  auth0Client = null;
  popupOpen = false;
  error = null;

  constructor({
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    redirectUri = window.location.href,
    ...options
  }) {
    this.options = {
      onRedirectCallback,
      redirectUri,
      ...options
    }
  }

  async init() {

    // Create a new instance of the SDK client using members of the given options object
    this.auth0Client = await createAuth0Client({
      ...this.options,
      redirect_uri: this.options.redirectUri
    });

    try {
      // If the user is returning to the app after authentication..
      if (
        window.location.search.includes('code=') &&
        window.location.search.includes('state=')
      ) {
        // handle the redirect and retrieve tokens
        const { appState } = await this.auth0Client.handleRedirectCallback();

        // Notify subscribers that the redirect callback has happened, passing the appState
        // (useful for retrieving any pre-authentication state)
        this.options.onRedirectCallback(appState);
      }
    } catch (e) {
      this.error = e;
    } finally {
      // Initialize our internal authentication state
      this.isAuthenticated = await this.auth0Client.isAuthenticated();
      this.user = await this.auth0Client.getUser();
      if (this.isAuthenticated) {
        store.dispatch(ActionTypes.USER_LOGIN, this.user);
      }
      this.loading = false;
    }
  }

  /** Authenticates the user using a popup window */
  async loginWithPopup(o) {
    this.popupOpen = true;

    try {
      await this.auth0Client.loginWithPopup(o);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    } finally {
      this.popupOpen = false;
    }

    this.user = await this.auth0Client.getUser();
    this.isAuthenticated = true;
    store.dispatch(ActionTypes.USER_LOGIN, this.user);
  }

  /** Handles the callback when logging in using a redirect */
  async handleRedirectCallback() {
    this.loading = true;
    try {
      await this.auth0Client.handleRedirectCallback();
      this.user = await this.auth0Client.getUser();
      this.isAuthenticated = true;
      store.dispatch(ActionTypes.USER_LOGIN, this.user);
    } catch (e) {
      this.error = e;
    } finally {
      this.loading = false;
    }
  }

  /** Authenticates the user using the redirect method */
  loginWithRedirect(o) {
    return this.auth0Client.loginWithRedirect(o);
  }

  /** Returns all the claims present in the ID token */
  getIdTokenClaims(o) {
    return this.auth0Client.getIdTokenClaims(o);
  }

  /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
  getTokenSilently(o) {
    return this.auth0Client.getTokenSilently(o);
  }

  /** Gets the access token using a popup window */

  getTokenWithPopup(o) {
    return this.auth0Client.getTokenWithPopup(o);
  }

  /** Logs the user out and removes their session on the authorization server */
  logout(o) {
    const result = this.auth0Client.logout(o);
    store.dispatch(ActionTypes.USER_LOGOUT);
    return result;
  }
}

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
  async install(Vue, options) {
    const auth0 = new useAuth0(options);
    await auth0.init();
    instance = auth0;
    Vue.config.globalProperties.$auth = auth0;
  }
};