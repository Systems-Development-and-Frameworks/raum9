const {ApolloServer, gql} = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');

const typeDefs = gql`
    type Post {
        id: ID!
        title: String!
        votes: Int!
        author: User!
    }

    type User {
        name: ID!
        posts: [Post]
    }

    type Query {
        posts: [Post]
        users: [User]
    }

    type Mutation {
        write(post: PostInput!): Post

        # ⚠️ FIXME in exercise #4
        # mock voter until we have authentication
        upvote(id: ID!, voter: UserInput!): Post
    }

    input PostInput {
        title: String!

        # ⚠️ FIXME in exercise #4
        # mock author until we have authentication
        author: UserInput!
    }

    input UserInput {
        name: String!
    }
`;

class PostDataStore extends RESTDataSource {

    constructor() {
        super();

        this.posts = [
            {
                id: 1,
                title: "Start Message",
                votes: 1
            }
        ]
    }

    async getPosts() {
        return this.posts;
    }
}

const resolvers = {
    Query: {
        posts: (parent, args, {dataSources}) => dataSources.postsDataStore.getPosts(),
    }
};

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
