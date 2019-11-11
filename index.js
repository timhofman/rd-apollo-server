const { ApolloServer, gql } = require('apollo-server');

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

const books = [
    {
        id: 1,
        title: 'Harry Potter and the Chamber of Secrets',
        author: 1,
    },
    {
        id: 2,
        title: 'Jurassic Park',
        author: 2,
    }
];

const authors = [
    {
        id: 1,
        name: 'J.K Rowling',
    },
    {
        id: 2,
        name: 'Michael Crichton',
    }
]

const resolvers = {
    Query: {
        getBooks: () => books,
        getAuthors: () => authors
    },
    Mutation: {
        addBook(parent, args) {
            console.log(args);
            books.push({
                id: Number(args.book.id),
                title: args.book.title,
                author: args.book.author
            });
            console.log(books);
            return books;
        },
    },
    Book: {
        author(parent) {
            return authors.filter(author => author.id === parent.author)
        } 
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(5000).then(( { url }) => {
    console.log(`Server ready at ${url}`);
});