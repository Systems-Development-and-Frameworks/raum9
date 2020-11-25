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

const MUTATE_WRITE = gql`
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
`;

const MUTATE_UPVOTE = gql`
    mutation($id: ID!, $voter: UserInput!) {
        upvote(id: $id, voter: $voter) {
            id
            title
            votes
        }
    }
`;

describe('server', () => {
    let server;
    beforeEach(() => {
        const userDataStore = new UserDataStore([
            {
                name: 'Max Mustermann'
            }
        ]);
        const postsDataStore = new PostDataStore(userDataStore, [
            {
                id: 1,
                title: 'Test Message 1',
                votes: [],
                author_id: 'Max Mustermann'
            },
            {
                id: 2,
                title: 'Test Message 2',
                votes: ['Max Mustermann'],
                author_id: 'Max Mustermann'
            }
        ]);
        server = new ApolloServer({
            typeDefs,
            resolvers,
            dataSources: () => ({
                userDataStore,
                postsDataStore
            })
        });
    });

    describe('all posts query', () => {
        it('return all posts', async () => {
            const {query} = createTestClient(server);

            const {data} = await query({query: GET_POSTS, variables: {id: 1}});
            expect(data.posts).toEqual([
                {title: 'Test Message 1', votes: 0},
                {title: 'Test Message 2', votes: 1}
            ]);
        });
    });

    describe('all user query', () => {
        it('return all user', async () => {
            const {query} = createTestClient(server);

            const {data} = await query({query: GET_USERS});
            expect(data.users).toEqual([{name: 'Max Mustermann'}]);
        });
    });

    /*
     Write
     */

    describe('write(post: $postInput)', () => {
        const opts = {
            mutation: MUTATE_WRITE,
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
            const {mutate} = createTestClient(server);

            const res = await mutate(opts);

            await expect(res).toMatchObject({
                errors: undefined,
                data: {
                    write: {
                        id: '3',
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
        it('adds a new votes', async () => {
            const {mutate} = createTestClient(server);

            const res = await mutate({
                mutation: MUTATE_UPVOTE,
                variables: {
                    id: 1,
                    voter: {
                        name: 'Max Mustermann'
                    }
                }
            });

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
            const {mutate} = createTestClient(server);

            const res = await mutate({
                mutation: MUTATE_UPVOTE,
                variables: {
                    id: 2,
                    voter: {
                        name: 'Max Mustermann'
                    }
                }
            });
            await expect(res).toMatchObject({
                errors: undefined,
                data: {
                    upvote: {
                        id: '2',
                        title: 'Test Message 2',
                        votes: 1
                    }
                }
            });
        });
    });
});
