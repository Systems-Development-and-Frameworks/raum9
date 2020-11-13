const {createTestClient} = require('apollo-server-testing');
const {ApolloServer, gql} = require('apollo-server');

const typeDefs = require('./TypeDefs')
const resolvers = require('./Resolvers')
const PostDataStore = require('./datastore/PostDataStore')
const UserDataStore = require('./datastore/UserDataStore')

const GET_POSTS = gql`
    query get_posts {
        posts {
            title
            votes
        }
    }
`;
const GET_USERS = gql`
    query get_user {
        users {
            name
        }
    }
`;

describe('all posts query', () => {
    it('return all posts', async () => {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                postsDataStore: new PostDataStore(new UserDataStore([
                    {
                        name: 'Max Mustermann'
                    }
                ]), [
                    {
                        id: 1,
                        title: "Test Message 1",
                        votes: 3,
                        author_id: 'Max Mustermann'
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

describe('all user query', () => {
    it('return all user', async () => {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                userDataStore: new UserDataStore([
                    {
                        name: "Max Mustermann"
                    }
                ])
            }),
        });

        // use the test server to create a query function
        const {query} = createTestClient(server);

        const {data: data} = await query({query: GET_USERS});
        expect(data.users).toEqual([{name: "Max Mustermann"}]);
    });
});