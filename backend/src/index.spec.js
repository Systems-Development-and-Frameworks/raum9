const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

let server;

describe('server', () => {
    beforeEach(() => {
        const userDataStore = new UserDataStore([
            new User(1, 'Max Mustermann', 'test@test.com', bcrypt.hashSync('12345678', 10)),
            new User(2, 'Martin Mustermann', 'martin@test.com', bcrypt.hashSync('12345678', 10))
        ]);
        const postDataStore = new PostDataStore(userDataStore, [
            new Post(1, 'Test Message 1', 1),
            new Post(2, 'Test Message 2', 2, new Map([[1, true]])),
            new Post(3, 'Test Message 3', 2, new Map([[1, false]]))
        ]);

        server = createServer(
            () => ({user: {uid: 1}}),
            () => ({
                userDataStore: userDataStore,
                postsDataStore: postDataStore
            })
        );
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
            expect(res.data.users).toEqual([
                {name: 'Max Mustermann'},
                {name: 'Martin Mustermann'}
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
