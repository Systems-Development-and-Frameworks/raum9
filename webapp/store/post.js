import {MUTATE_DELETE, MUTATE_DOWNVOTE, MUTATE_UPVOTE, MUTATE_WRITE, QUERY_POSTS} from '@/graphql/mutations';
import {ADD_POST, SET_POSTS} from '.';

export const state = () => ({
  posts: []
})

export const getters = {
  getPosts(state) {
    return state.posts;
  }
}

export const mutations = {
  [SET_POSTS](state, posts) {
    state.posts = posts;
  },
  [ADD_POST](state, post) {
    state.posts.push(post);
  }
}

export const actions = {
  async write({commit}, {title}) {
    try {
      const client = this.app.apolloProvider.defaultClient;
      const {data} = await client.mutate({
        mutation: MUTATE_WRITE,
        variables: {
          title
        },
        context: {
          headers: {
            Authentication: 'Bearer ' + this.$apolloHelpers.getToken()
          }
        }
      });
      commit(ADD_POST, data.write);
    } finally {
    }
  },

  async fetchPosts({commit}) {
    try {
      const client = this.app.apolloProvider.defaultClient;
      const {data} = await client.query({
        query: QUERY_POSTS
      });
      commit(SET_POSTS, data.posts);
    } finally {
    }
  },

  async upvotePost({commit}, {id}) {
    try {
      const client = this.app.apolloProvider.defaultClient;
      const {data} = await client.mutate({
        mutation: MUTATE_UPVOTE,
        variables: {
          id
        },
        context: {
          headers: {
            Authentication: 'Bearer ' + this.$apolloHelpers.getToken()
          }
        }
      });
    } finally {
    }
  },
  async downvotePost({commit}, {id}) {
    try {
      const client = this.app.apolloProvider.defaultClient;
      const {data} = await client.mutate({
        mutation: MUTATE_DOWNVOTE,
        variables: {
          id
        },
        context: {
          headers: {
            Authentication: 'Bearer ' + this.$apolloHelpers.getToken()
          }
        }
      });
    } finally {
    }
  },
  async deletePost({commit}, {id}) {
    try {
      const client = this.app.apolloProvider.defaultClient;
      const {data} = await client.mutate({
        mutation: MUTATE_DELETE,
        variables: {
          id
        },
        context: {
          headers: {
            Authentication: 'Bearer ' + this.$apolloHelpers.getToken()
          }
        }
      });
    } finally {
    }
  }
}
