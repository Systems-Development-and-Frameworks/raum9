const {ApolloServer} = require('apollo-server');

const typeDefs = require('./TypeDefs');
const resolvers = require('./Resolvers');
const context = require('./AuthenticationContent');
const PostDataStore = require('./datastore/PostDataStore');
const UserDataStore = require('./datastore/UserDataStore');

const userDataStore = new UserDataStore();
const postDataStore = new PostDataStore(userDataStore);

const server = new ApolloServer({
    typeDefs,
    resolvers,
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
