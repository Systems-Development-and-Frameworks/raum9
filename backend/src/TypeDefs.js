const {gql} = require('apollo-server');

module.exports = gql`
    type Query {
        posts: [Post]
        users: [User]
    }

    type Mutation {
        write(post: PostInput!): Post
        upvote(id: ID!): Post
        downvote(id: ID!): Post
        delete(id: ID!): Post

        """
        returns a signed JWT or null
        """
        login(email: String!, password: String!): String

        """
        returns a signed JWT or null
        """
        signup(name: String!, email: String!, password: String!): String
    }

    input PostInput {
        title: String!
    }
`;
