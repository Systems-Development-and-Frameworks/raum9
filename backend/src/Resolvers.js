module.exports = {
    Query: {
        posts: (parent, args, {dataSources}) => dataSources.postsDataStore.allPosts(),
        users: (parent, args, {dataSources}) => dataSources.userDataStore.allUsers()
    },

    Post: {
        author: (parent, args, {dataSources}) => dataSources.userDataStore.getUserById(parent.author_id),
        votes: async (parent, args, {dataSources}) => {
            return dataSources.postsDataStore.getVoteCount(parent);
        }
    },

    User: {
        posts: async (parent, args, {dataSources}) => {
            const posts = await dataSources.postsDataStore.allPosts();
            return posts.filter(post => post.author_id === parent.name);
        }
    },
    Mutation: {
        write: async (parent, args, {user, dataSources}) => {
            const title = args.post.title;
            return dataSources.postsDataStore.createPost(title);
        },
        upvote: async (parent, args, {dataSources}) => {
            const postId = args.id;
            return dataSources.postsDataStore.upvotePost(postId);
        },
        downvote: async (parent, args, {dataSources}) => {
            const postId = args.id;
            return dataSources.postsDataStore.downvotePost(postId);
        },
        delete: async (parent, args, {dataSources}) => {
            const postId = args.id;
            return dataSources.postsDataStore.deletePost(postId);
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
