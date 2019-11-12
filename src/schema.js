const { gql } = require('apollo-server');

/**
 * The 'LenghtAtMost25' must be declared, even while it's generated on the fly
 * by our custom LengthDirective implementation. Otherwise tools like the performance
 * tracer can't do a full introspective of the GraphQL schema.
 */
const typeDefs = gql`
    directive @length(max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION
    scalar LengthAtMost25

    type Book {
        id: ID!,
        title: String! @length(max: 25)
        author: Author
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
        updateBook(id: Int, title: String!): Book
    }

    input BookInput {
        id: ID!
        title: String!
        author: String!
    }
`;

module.exports = typeDefs;