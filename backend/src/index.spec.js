const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

const {createTestClient} = require('apollo-server-testing');
const {gql} = require('apollo-server');

const {PostDataStore, Post} = require('./datastore/PostDataStore');
const {UserDataStore, User} = require('./datastore/UserDataStore');

const createServer = require('./server');

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

const GET_USERS_FORBIDDEN = gql`
    query get_user {
        users {
            name
            email
        }
    }
`;

const MUTATE_LOGIN = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password: $password)
    }
`;

const MUTATE_SIGNUP = gql`
    mutation($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password)
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
    mutation($id: ID!) {
        upvote(id: $id) {
            id
            title
            votes
        }
    }
`;

const MUTATE_DOWNVOTE = gql`
    mutation($id: ID!) {
        downvote(id: $id) {
            id
            title
            votes
        }
    }
`;

const MUTATE_DELETE = gql`
    mutation($id: ID!) {
        delete(id: $id) {
            id
            title
        }
    }
`;

const cleanDatabase = async () => {
    const driver = require('./database/Neo4jDriver');
    await driver
        .session()
        .writeTransaction(txc => txc.run('MATCH(n) DETACH DELETE n;'));
};

let server;

describe('server', () => {
    beforeEach(async () => {
        // Clear Database
        await cleanDatabase();

        const userDataStore = new UserDataStore();
        await userDataStore.createUsers([
            new User(1, 'Max Mustermann', 'test@test.com', '12345678'),
            new User(2, 'Martin Mustermann', 'martin@test.com', '12345678')
        ]);

        const user1 = await userDataStore.getUserById(1);
        const user2 = await userDataStore.getUserById(2);

        const postDataStore = new PostDataStore(userDataStore);
        await postDataStore.createPosts([
            new Post({id: 1, title: 'Test Message 1', author: user1}),
            new Post({id: 2, title: 'Test Message 2', author: user2}),
            new Post({id: 3, title: 'Test Message 3', author: user2})
        ]);

        await postDataStore.vote(2, 1, user1);
        await postDataStore.vote(3, -1, user1);

        server = createServer(
            () => ({user: {uid: 1}}),
            () => ({
                userDataStore: userDataStore,
                postsDataStore: postDataStore
            })
        );
    });

    afterAll(async () => {
        await cleanDatabase();
        const driver = require('./database/Neo4jDriver');
        const neode = require('./database/NeodeConfiguration');
        await driver.close();
        await neode.driver.close();
    });

    describe('all posts query', () => {
        it('return all posts', async () => {
            const {query} = createTestClient(server);

            const res = await query({query: GET_POSTS, variables: {id: 1}});
            expect(res.data.posts).toEqual([
                {title: 'Test Message 1', votes: 0},
                {title: 'Test Message 2', votes: 1},
                {title: 'Test Message 3', votes: -1}
            ]);
        });
    });

    describe('all user query', () => {
        it('return all user', async () => {
            const {query} = createTestClient(server);

            const res = await query({query: GET_USERS});
            expect(res.data.users.sort((o1, o2) => o1.name < o2.name)).toEqual([
                {name: 'Max Mustermann'},
                {name: 'Martin Mustermann'},
            ]);
        });

        it('return all user forbidden', async () => {
            const {query} = createTestClient(server);

            const res = await query({query: GET_USERS_FORBIDDEN});
            expect(res.errors).toBeTruthy();
        });
    });

    describe('signup query', () => {
        it('signup new user', async () => {
            const opts = {
                mutation: MUTATE_SIGNUP,
                variables: {
                    name: 'Martina Mustermann',
                    email: 'martina@test.com',
                    password: '12345678'
                }
            };
            const {mutate} = createTestClient(server);

            const res = await mutate(opts);
            expect(jwt.verify(res.data.signup, process.env.JWT_SECRET)).toBeTruthy();
        });
    });

    describe('login query', () => {
        it('login user', async () => {
            const opts = {
                mutation: MUTATE_LOGIN,
                variables: {
                    email: 'test@test.com',
                    password: '12345678'
                }
            };
            const {mutate} = createTestClient(server);

            const res = await mutate(opts);
            expect(jwt.verify(res.data.login, process.env.JWT_SECRET)).toBeTruthy();
        });
        it('login user failed', async () => {
            const opts = {
                mutation: MUTATE_LOGIN,
                variables: {
                    email: 'test@test.com',
                    password: '123456'
                }
            };
            const {mutate} = createTestClient(server);

            const res = await mutate(opts);
            expect(res.errors).toBeTruthy();
        });
    });
    /*
    LoggedIn Testcases
     */

    describe('actions where logging in is needed', () => {
        describe('write(post: $postInput)', () => {
            const opts = {
                mutation: MUTATE_WRITE,
                variables: {
                    postInput: {
                        title: 'New Post'
                    }
                }
            };

            it('writes a post', async () => {
                const {mutate} = createTestClient(server);
                const res = await mutate(opts);
                expect(res).toMatchObject({
                    errors: undefined,
                    data: {
                        write: {
                            id: '4',
                            title: 'New Post',
                            author: {name: 'Max Mustermann'}
                        }
                    }
                });
            });
        });

        describe('upvote(id: ID!)', () => {
            it('adds a new upvote', async () => {
                const {mutate} = createTestClient(server);

                const res = await mutate({
                    mutation: MUTATE_UPVOTE,
                    variables: {
                        id: 1
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
                        id: 2
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

        describe('downvote(id: ID!)', () => {
            it('adds a new downvote', async () => {
                const {mutate} = createTestClient(server);

                const res = await mutate({
                    mutation: MUTATE_DOWNVOTE,
                    variables: {
                        id: 1
                    }
                });

                await expect(res).toMatchObject({
                    errors: undefined,
                    data: {
                        downvote: {
                            id: '1',
                            title: 'Test Message 1',
                            votes: -1
                        }
                    }
                });
            });

            it('not a new vote if user already voted', async () => {
                const {mutate} = createTestClient(server);

                const res = await mutate({
                    mutation: MUTATE_DOWNVOTE,
                    variables: {
                        id: 3
                    }
                });
                await expect(res).toMatchObject({
                    errors: undefined,
                    data: {
                        downvote: {
                            id: '3',
                            title: 'Test Message 3',
                            votes: -1
                        }
                    }
                });
            });
        });

        describe('delete(id: ID!)', () => {
            it('deletes own post', async () => {
                const {mutate} = createTestClient(server);

                const res = await mutate({
                    mutation: MUTATE_DELETE,
                    variables: {
                        id: 1
                    }
                });

                await expect(res).toMatchObject({
                    errors: undefined,
                    data: {
                        delete: {
                            id: '1',
                            title: 'Test Message 1'
                        }
                    }
                });
            });

            it('deletes foreign post', async () => {
                const {mutate} = createTestClient(server);

                const res = await mutate({
                    mutation: MUTATE_DELETE,
                    variables: {
                        id: 2
                    }
                });

                expect(res.errors).toBeTruthy();
            });
        });
    });
});
