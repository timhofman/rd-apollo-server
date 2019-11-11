const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./src/schema');
const casual = require('casual');

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
        addBook : (parent, args) => {
            const newBook = {
                id: Number(args.book.id),
                title: args.book.title,
                author: args.book.author
            };
            books.push(newBook);
            return newBook;
        },
        updateBook : (parent, args) => {
            const book = books.filter(book => book.id === args.id);
            book[0].title = args.title;
            return book[0];
        },
    },
    Book: {
        author : (parent) => {
            return authors.filter(author => author.id === parent.author)
        } 
    },
};

/**
 * Mocking test
 * To use this make sure that mockEntireSchema is set to 'true'
 */
const mocks = {
    Query: () => ({
        getBooks: () => ([
            {
                id: casual.integer(1,10000),
                title: casual.name,
            },
            {
                id: casual.integer(1,10000),
                title: casual.name,
            }
        ]),
    })
}

const server = new ApolloServer({ typeDefs, resolvers, mocks, mockEntireSchema: false});
server.listen(5000).then(( { url }) => {
    console.log(`Server ready at ${url}`);
});