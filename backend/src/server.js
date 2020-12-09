const {ApolloServer} = require('apollo-server');
const {stitchSchemas} = require('@graphql-tools/stitch');

const typeDefs = require('./TypeDefs');
const neo4jSchema = require('./database/Neo4jSchema');
const resolvers = require('./Resolvers');
const _context = require('./Context');
const {PostDataStore} = require('./datastore/PostDataStore');
const {UserDataStore} = require('./datastore/UserDataStore');

const {applyMiddleware} = require('graphql-middleware');
const permissions = require('./Permissions');

const userDataStore = new UserDataStore();
const postDataStore = new PostDataStore(userDataStore);

const stitchSchema = stitchSchemas({
    subschemas: [neo4jSchema],
    typeDefs,
    resolvers
});

const schema = applyMiddleware(
    stitchSchema,
    permissions
);

// default/prod DataSources
const _dataSources = () => ({
    userDataStore: userDataStore,
    postsDataStore: postDataStore
});

const createServer = (context = _context, dataSources = _dataSources) => (
    new ApolloServer({
        schema,
        context: context,
        dataSources: dataSources
    })
);

module.exports = createServer;
