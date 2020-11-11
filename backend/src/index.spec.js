const {createTestClient} = require('apollo-server-testing');
const {ApolloServer, gql} = require('apollo-server');

const typeDefs = require('./TypeDefs')
const resolvers = require('./Resolvers')
const PostDataStore = require('./PostDataStore')

const GET_POSTS = gql`
    query get_posts {
        posts {
            title
            votes
        }
    }
`;

it('fetches single launch', async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({postsDataStore: new PostDataStore()}),
    });

    // use the test server to create a query function
    const {query} = createTestClient(server);

    // run query against the server and snapshot the output
    const res = await query({query: GET_POSTS, variables: {id: 1}});
    expect(res).toMatchSnapshot();
});