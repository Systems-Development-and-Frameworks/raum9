const { makeAugmentedSchema } = require('neo4j-graphql-js');
const {gql} = require('apollo-server');

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String
        posts: [Post] @relation(name: "WROTE", direction: "OUT")
    }

    type Post {
        id: ID!
        title: String!
        votes: Int!
        author: User @relation(name: "WROTE", direction: "IN")
    }
`;

const schema = makeAugmentedSchema({ typeDefs });
module.exports = schema;
