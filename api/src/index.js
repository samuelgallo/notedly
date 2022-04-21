require('dotenv').config();

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const db = require('./db');

const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

// let notes = [
//   {
//     id: '1',
//     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     author: 'Adam'
//   },
//   {
//     id: '2',
//     content: 'Duis vulputate mattis augue, a feugiat odio placerat eget. '
//   },
//   {
//     id: '3',
//     content: 'Phasellus aliquam convallis ligula vitae scelerisque.',
//     author: 'Test'
//   }
// ];

// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//     notes: async () => {
//       return await models.Note.find();
//     },
//     note: async (parent, args) => {
//       //return notes.find(note => note.id === args.id);
//       return await models.Note.findById(args.id);
//     }
//   },
//   Mutation: {
//     newNote: async (parent, args) => {
//       return await models.Note.create({
//         content: args.content,
//         author: args.author
//       });
//     }
//   }
// };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  }
});

server.applyMiddleware({ app, path: '/api' });

//app.get('/', (req, res) => res.send('Hello World'));
app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
