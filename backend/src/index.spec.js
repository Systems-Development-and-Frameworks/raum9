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

describe('all posts query', () => {
    it('return all posts', async () => {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                postsDataStore: new PostDataStore([
                    {
                        id: 1,
                        title: "Test Message 1",
                        votes: 3
                    }
                ])
            }),
        });

        // use the test server to create a query function
        const {query} = createTestClient(server);

        const {data: data} = await query({query: GET_POSTS, variables: {id: 1}});
        expect(data.posts).toEqual([{title: "Test Message 1", votes: 3}]);
    });
});