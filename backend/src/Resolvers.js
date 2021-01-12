module.exports = {
    Query: {
        posts: (parent, args, {dataSources}) => dataSources.postsDataStore.allPosts(),
        users: (parent, args, {dataSources}) => dataSources.userDataStore.allUsers()
    },

    Post: {
        votes: async (parent, args, {dataSources}) => {
            return dataSources.postsDataStore.getVoteCount(parent);
        }
    },

    User: {
        posts: async (parent, args, {dataSources}) => {
            const posts = await dataSources.postsDataStore.allPosts();
            return posts.filter(post => post.author.id === parent.id);
        }
    },
    Mutation: {
        write: async (parent, args, {dataSources}) => {
            return dataSources.postsDataStore.createPostForCurrentUser(args.post.title);
        },
        upvote: async (parent, args, {dataSources}) => {
            return dataSources.postsDataStore.upvotePost(args.id);
        },
        downvote: async (parent, args, {dataSources}) => {
            return dataSources.postsDataStore.downvotePost(args.id);
        },
        delete: async (parent, args, {dataSources}) => {
            return dataSources.postsDataStore.deletePost(args.id);
        },
        signup: async (parent, args, {dataSources}) => {
            const {name, email, password} = args;
            const createdUser = await dataSources.userDataStore.createUser(name, email, password);
            return await dataSources.userDataStore.authenticateUser(createdUser.email, password);
        },
        login: async (parent, args, {dataSources}) => {
            const {email, password} = args;
            return dataSources.userDataStore.authenticateUser(email, password);
        }
    }
};
