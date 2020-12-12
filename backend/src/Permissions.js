const {rule, shield} = require('graphql-shield');

const isAuthenticated = rule({cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        const token = ctx.user;
        if (!token) {
            return false;
        }
        return ctx.dataSources.userDataStore.getUserById(token.uid);
    }
);

const isOwnUser = rule({})(
    async ({email}, args, ctx, info) => {
        const token = ctx.user;
        if (!token) {
            return false;
        }
        const user = ctx.dataSources.userDataStore.getUserById(token.uid);
        return user && user.email === email;
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
