const {rule, shield} = require('graphql-shield');

const isAuthenticated = rule({cache: 'contextual'})(
    async (parent, args, ctx) => {
        const token = ctx.user;
        if (!token) {
            return false;
        }
        const user = await ctx.dataSources.userDataStore.getUserById(token.uid);
        return !!user;
    }
);

const isOwnUser = rule({})(
    async (parent, args, ctx) => {
        const token = ctx.user;
        if (!token) {
            return false;
        }
        const user = await ctx.dataSources.userDataStore.getUserById(token.uid);
        return user && user.email === parent.email;
    }
);

const permissions = shield(
    {
        User: {
            email: isOwnUser
        },
        Query: {
            posts: isAuthenticated
        },
        Mutation: {
            write: isAuthenticated,
            upvote: isAuthenticated,
            downvote: isAuthenticated,
            delete: isAuthenticated
        }
    },
    {
        allowExternalErrors: true
    }
);

module.exports = permissions;
