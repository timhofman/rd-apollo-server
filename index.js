const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./src/schema');

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
        author(parent) {
            return authors.filter(author => author.id === parent.author)
        } 
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(5000).then(( { url }) => {
    console.log(`Server ready at ${url}`);
});