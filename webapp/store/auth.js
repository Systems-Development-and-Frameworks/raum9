import {SET_USER, SET_TOKEN, SET_LOADING} from '.';
import {MUTATE_LOGIN} from '@/graphql/mutations';


export const state = () => ({
  loading: false,
  token: null,
  currentUser: null,
});

export const getters = {
  loggedIn(state) {
    return !!state.token;
  },
};

export const mutations = {
  [SET_TOKEN](state, token) {
    state.token = token;
  },
  [SET_USER](state, user) {
    state.currentUser = user;
  },
  [SET_LOADING](state, loading) {
    state.loading = loading;
  },
};

export const actions = {
  async login({commit}, {email, password}) {
    commit(SET_LOADING, true);
    try {
      const client = this.app.apolloProvider.defaultClient;
      const {data} = await client.mutate({
        mutation: MUTATE_LOGIN,
        variables: {
          email,
          password
        }
      });
      commit(SET_TOKEN, data.login);
      commit(SET_USER, data.login);
      await this.$apolloHelpers.onLogin(data.login);
    } finally {
      commit(SET_LOADING, false);
    }
  },
  async logout({commit}) {
    commit(SET_TOKEN, null);
    commit(SET_USER, null);
    await this.$apolloHelpers.onLogout();
  }
};
