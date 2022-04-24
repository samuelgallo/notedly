require('dotenv').config();

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');

const db = require('./db');

const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
app.use(helmet());
app.use(cors());

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // if there's a problem with th token
      throw new Error('Session invalid');
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: async ({ req }) => {
    // get user token from headers
    const token = req.headers.authorization;

    // try to retrieve a user with token
    const user = await getUser(token);

    console.log(user);

    return { models, user };
  }
});

server.applyMiddleware({ app, path: '/api' });

//app.get('/', (req, res) => res.send('Hello World'));
app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
