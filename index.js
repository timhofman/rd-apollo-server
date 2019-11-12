import express from 'express';
import http from 'http';
import assert from 'chai';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv'
import { ApolloServer, gql, AuthenticationError, MockList, SchemaDirectiveVisitor } from 'apollo-server-express';
import { GraphQLScalarType, GraphQLNonNull } from 'graphql';

import typeDefs from './src/schema';
import casual from 'casual';
import { APP_SECRET, authenticate } from './lib/authentication';

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
        }
    },
    Book: {
        author : (parent) => {
            return authors.filter(author => author.id === parent.author)[0]
        } 
    },
};

/**
 * Mocking test
 * To use this make sure that mockEntireSchema is set to 'true'
 */
const mocks = {
    Book: () => ({
        id: () => casual.integer(1,10000),
        title: () => casual.name,
        author: () => new MockList([1,1]),
    }),
    Author: () => ({
        id: () => casual.integer(1,10000),
        name: () => casual.name,
    }),
}

class LengthDirective extends SchemaDirectiveVisitor {
    visitInputFieldDefinition(field) {
        this.wrapType(field);
    }

    visitFieldDefinition(field) {
        this.wrapType(field);
    }

    wrapType(field) {
        if (
            field.type instanceof GraphQLNonNull &&
            field.type.ofType instanceof GraphQLScalarType
          ) {
            field.type = new GraphQLNonNull(
              new LimitedLengthType(field.type.ofType, this.args.max),
            );
          } else if (field.type instanceof GraphQLScalarType) {
            field.type = new LimitedLengthType(field.type, this.args.max);
          } else {
            throw new Error(`Not a scalar type: ${field.type}`);
          }
    }
}

class LimitedLengthType extends GraphQLScalarType {
    constructor(type, maxLength) {
        super({
            name: `LengthAtMost${maxLength}`,

            serialize(value) {
              value = type.serialize(value);
              assert.assert.isAtMost(value.length, maxLength);
              return value;
            },
            parseValue(value) {
              return type.parseValue(value);
            },
            parseLiteral(ast) {
              return type.parseLiteral(ast);
            },
        });
    }
}

const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        if (!authenticate(req)) {
            throw new AuthenticationError('Your token is not valid.');
        }
    },
    mocks: mocks,
    mockEntireSchema: false,
    schemaDirectives: {
        length: LengthDirective,
    }
});

server.applyMiddleware({ app });
app.use('/', (req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8')
    res.write('Hello World');
    res.end();
});

const httpServer = http.createServer(app);
const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.subscriptionsPath}`);
});