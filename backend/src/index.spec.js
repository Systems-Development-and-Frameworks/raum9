const {createTestClient} = require('apollo-server-testing');
const {ApolloServer, gql} = require('apollo-server');

const typeDefs = require('./TypeDefs');
const resolvers = require('./Resolvers');
const PostDataStore = require('./datastore/PostDataStore');
const UserDataStore = require('./datastore/UserDataStore');

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
                        title: 'Test Message 1',
                        votes: ['Max Mustermann'],
                        author_id: 'Max Mustermann'
                    }
                ])
            })
        });

        // use the test server to create a query function
        const {query} = createTestClient(server);

        const {data} = await query({query: GET_POSTS, variables: {id: 1}});
        expect(data.posts).toEqual([{title: 'Test Message 1', votes: 1}]);
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
                        name: 'Max Mustermann'
                    }
                ])
            })
        });

        // use the test server to create a query function
        const {query} = createTestClient(server);

        const {data} = await query({query: GET_USERS});
        expect(data.users).toEqual([{name: 'Max Mustermann'}]);
    });
});

describe('write(post: $postInput)', () => {
    const opts = {
        mutation: gql`
            mutation($postInput: PostInput!) {
                write(post: $postInput) {
                    id
                    title
                    votes
                    author {
                        name
                    }
                }
            }
        `,
        variables: {
            postInput: {
                title: 'New Post',
                author: {
                    name: 'Max Mustermann'
                }
            }
        }
    };

    it('creates and returns a post', async () => {
        const userDataStore = new UserDataStore([
            {
                name: 'Max Mustermann'
            }
        ]);
        const postDataStore = new PostDataStore(userDataStore, [
            {
                id: 1,
                title: 'Test Message 1',
                votes: [],
                author_id: 'Max Mustermann'
            }
        ]);
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                userDataStore: userDataStore,
                postsDataStore: postDataStore
            })
        });

        // use the test server to create a query function
        const {mutate} = createTestClient(server);

        const res = await mutate(opts);

        await expect(res).toMatchObject({
            errors: undefined,
            data: {
                write: {
                    id: '2',
                    title: 'New Post',
                    author: {name: 'Max Mustermann'}
                }
            }
        });
    });
});

/*
Upvote test
 */

describe('upvote(id: ID!, voter: UserInput!)', () => {
    const opts = {
        mutation: gql`
            mutation($id: ID!, $voter: UserInput!) {
                upvote(id: $id, voter: $voter) {
                    id
                    title
                    votes
                }
            }
        `,
        variables: {
            id: 1,
            voter: {
                name: 'Max Mustermann'
            }
        }
    };

    it('adds a new votes', async () => {
        const userDataStore = new UserDataStore([
            {
                name: 'Max Mustermann'
            }
        ]);
        const postDataStore = new PostDataStore(userDataStore, [
            {
                id: 1,
                title: 'Test Message 1',
                votes: [],
                author_id: 'Max Mustermann'
            }
        ]);
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                userDataStore: userDataStore,
                postsDataStore: postDataStore
            })
        });

        // use the test server to create a query function
        const {mutate} = createTestClient(server);

        const res = await mutate(opts);

        await expect(res).toMatchObject({
            errors: undefined,
            data: {
                upvote: {
                    id: '1',
                    title: 'Test Message 1',
                    votes: 1
                }
            }
        });
    });

    it('not a new vote if user already voted', async () => {
        const userDataStore = new UserDataStore([
            {
                name: 'Max Mustermann'
            }
        ]);
        const postDataStore = new PostDataStore(userDataStore, [
            {
                id: 1,
                title: 'Test Message 1',
                votes: ['Max Mustermann'],
                author_id: 'Max Mustermann'
            }
        ]);
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                userDataStore: userDataStore,
                postsDataStore: postDataStore
            })
        });

        // use the test server to create a query function
        const {mutate} = createTestClient(server);

        const res = await mutate(opts);

        await expect(res).toMatchObject({
            errors: undefined,
            data: {
                upvote: {
                    id: '1',
                    title: 'Test Message 1',
                    votes: 1
                }
            }
        });
    });
});
