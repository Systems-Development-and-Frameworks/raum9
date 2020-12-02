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

// default/prod DataSources
const dataSources = () => ({
    userDataStore: userDataStore,
    postsDataStore: postDataStore
})

const createServer =(context = context, dataSources = dataSources) => (
    new ApolloServer({
        schema,
        context: context,
        dataSources: dataSources
    })
);

module.exports = createServer