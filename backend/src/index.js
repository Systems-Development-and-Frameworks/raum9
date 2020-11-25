const {ApolloServer} = require('apollo-server');

const typeDefs = require('./TypeDefs');
const resolvers = require('./Resolvers');
const context = require('./AuthenticationContent');
const PostDataStore = require('./datastore/PostDataStore');
const UserDataStore = require('./datastore/UserDataStore');

const {applyMiddleware} = require('graphql-middleware');
const {makeExecutableSchema} = require('graphql-tools');
const permissions = require('./Permissions');

const userDataStore = new UserDataStore();
const postDataStore = new PostDataStore(userDataStore);

const schema = applyMiddleware(
    makeExecutableSchema({
        typeDefs,
        resolvers
    }),
    permissions
);
const server = new ApolloServer({
    schema,
    context,
    dataSources: () => ({
        userDataStore: userDataStore,
        postsDataStore: postDataStore
    })
});

// The `listen` method launches a web server.
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
