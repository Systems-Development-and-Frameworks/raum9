const {ApolloServer, gql} = require('apollo-server');

const typeDefs = require('./TypeDefs')
const resolvers = require('./Resolvers')
const PostDataStore = require('./datastore/PostDataStore')
const UserDataStore = require('./datastore/UserDataStore')

const userDataStore = new UserDataStore();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        userDataStore: userDataStore,
        postsDataStore: new PostDataStore(userDataStore)
    })
});

// The `listen` method launches a web server.
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
