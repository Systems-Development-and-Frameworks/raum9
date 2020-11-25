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

const permissions = shield({
    Query: {
        posts: isAuthenticated
    },
    Mutation: {}
});

module.exports = permissions;
