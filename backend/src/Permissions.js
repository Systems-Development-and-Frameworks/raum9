const {rule, shield} = require('graphql-shield');

const isAuthenticated = rule({cache: 'contextual'})(
    async (parent, args, ctx, info) => {
        const token = ctx.user;
        if (token) {
            const user = ctx.dataSources.userDataStore.getUserById(token.uid);
            if (user) {
                return true;
            }
        }
        return false;
    }
);

const isOwner = rule({})(
    async ({ email }, args, ctx, info) => {
        const token = ctx.user;
        if (token) {
            const user = ctx.dataSources.userDataStore.getUserById(token.uid);
            if (user && user.email === email) {
                return true;
            }
        }
        return false;
    }
);

const permissions = shield({
    User: {
        email: isOwner
    },
    Query: {
        posts: isAuthenticated
    },
    Mutation: {
        write: isAuthenticated,
        upvote: isAuthenticated
    }
});

module.exports = permissions;
