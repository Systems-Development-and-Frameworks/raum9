const {ApolloServer, gql} = require('apollo-server');

const typeDefs = require('./TypeDefs')
const resolvers = require('./Resolvers')
const PostDataStore = require('./PostDataStore')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        postsDataStore: new PostDataStore()
    })
});

// The `listen` method launches a web server.
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
