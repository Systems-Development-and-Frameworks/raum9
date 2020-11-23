module.exports = {
    Query: {
        posts: (parent, args, {dataSources}) => dataSources.postsDataStore.allPosts(),
        users: (parent, args, {dataSources}) => dataSources.userDataStore.allUsers()
    },

    Post: {
        author: (parent, args, {dataSources}) => dataSources.userDataStore.getUserById(parent.author_id),
        votes: async (parent, args, {dataSources}) => {
            return parent.votes.length;
        }
    },

    User: {
        posts: async (parent, args, {dataSources}) => {
            const posts = await dataSources.postsDataStore.allPosts();
            return posts.filter(post => post.author_id === parent.name);
        }
    },
    Mutation: {
        write: async (parent, args, {dataSources}) => {
            const title = args.post.title;
            const authorId = args.post.author.name;
            return dataSources.postsDataStore.createPost(title, authorId);
        },
        upvote: async (parent, args, {dataSources}) => {
            const postId = args.id;
            const voter = args.voter.name;
            return dataSources.postsDataStore.upvotePost(postId, voter);
        }
    }
};
