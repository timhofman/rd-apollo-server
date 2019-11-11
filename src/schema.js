const { gql } = require('apollo-server');

const typeDefs = gql`
    type Book {
        id: ID!,
        title: String!
        author: [Author]
    }

    type Author {
        id: ID!,
        name: String!
        books: [Book]
    }

    type Query {
        getBooks: [Book]
        getAuthors: [Author]
    }

    type Mutation {
        addBook(book: BookInput): Book
    }

    input BookInput {
        id: ID!
        title: String!
        author: String!
    }
`;

module.exports = typeDefs;