const {gql} = require('apollo-server');

module.exports = gql`
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
