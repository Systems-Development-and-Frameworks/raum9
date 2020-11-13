module.exports = {
    Query: {
        posts: (parent, args, {dataSources}) => dataSources.postsDataStore.allPosts(),
        users: (parent, args, {dataSources}) => dataSources.userDataStore.allUsers(),
    },

    Post: {
        author: (parent, args, {dataSources}) => dataSources.userDataStore.getUserById(parent.author_id),
        votes: async (parent, args, {dataSources}) => {
            return parent.votes.length;
        },
    },

    User: {
        posts: async (parent, args, {dataSources}) => {
            let posts = await dataSources.postsDataStore.allPosts();
            return posts.filter(post => post.author_id === parent.name);
        }
    },
    Mutation: {
        write: async (parent, args, {dataSources}) => {
            let title = args.post.title;
            let author_id = args.post.author.name;
            return dataSources.postsDataStore.createPost(title, author_id);
        },
        upvote: async (parent, args, {dataSources}) => {
            let postId = args.id;
            let voter = args.voter.name;
            return dataSources.postsDataStore.upvotePost(postId, voter);
        }
    }
};
