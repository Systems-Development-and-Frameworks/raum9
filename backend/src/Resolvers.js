module.exports = {
    Query: {
        posts: (parent, args, {dataSources}) => dataSources.postsDataStore.allPosts(),
    }
};
