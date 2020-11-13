module.exports = {
    Query: {
        posts: (parent, args, {dataSources}) => dataSources.postsDataStore.allPosts(),
        users: (parent, args, {dataSources}) => dataSources.userDataStore.allUsers(),
    },
    User: {
        posts: async (parent, args, {dataSources}) => {
            let posts = await dataSources.postsDataStore.allPosts();
            return posts.filter(post => post.author_id === parent.name)
        }
    },
};
