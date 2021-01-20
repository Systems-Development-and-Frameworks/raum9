// in store/index.js
import cookie from 'cookie';


export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const SET_LOADING = 'SET_LOADING';

export const SET_POSTS = 'SET_POSTS';
export const ADD_POST = 'ADD_POST';

export const actions = {
  nuxtServerInit(store, context) {
    const {req} = context.ssrContext;
    if (!req) {
      return;
    } // static site generation
    if (!req.headers.cookie) {
      return;
    }
    const parsedCookies = cookie.parse(req.headers.cookie);
    const token = parsedCookies['apollo-token'];
    if (!token) {
      return;
    }
    store.commit('auth/SET_TOKEN', token);
  },
};
