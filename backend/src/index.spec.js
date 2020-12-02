const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {createTestClient} = require('apollo-server-testing');
const {gql} = require('apollo-server');

const PostDataStore = require('./datastore/PostDataStore');
const UserDataStore = require('./datastore/UserDataStore');

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

let server;

describe('server', () => {
    beforeEach(() => {
        const userDataStore = new UserDataStore([
            {
                id: 1,
                name: 'Max Mustermann',
                email: 'test@test.com',
                password: bcrypt.hashSync('12345678', 10)
            },
            {
                id: 2,
                name: 'Martin Mustermann',
                email: 'martin@test.com',
                password: bcrypt.hashSync('12345678', 10)
            }
        ]);
        const postDataStore = new PostDataStore(userDataStore, [
            {
                id: 1,
                title: 'Test Message 1',
                votes: [],
                author_id: 'Max Mustermann'
            },
            {
                id: 2,
                title: 'Test Message 2',
                votes: [1],
                author_id: 'Max Mustermann'
            }
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
                {title: 'Test Message 2', votes: 1}
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
        /*
        Write
         */

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

        describe('upvote(id: ID!)', () => {
            it('adds a new votes', async () => {
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
    });
});
