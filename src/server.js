/* Import all the building blocks */
import 'babel-polyfill';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import cors from 'cors';
import typeDefs from './schemas';
import resolvers from './resolvers';

/* Get the correct environment variables */
const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];

/* Apply rate limiter rules */
const rateLimiter = new RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
});

/* Define the ApolloServer */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ headers: req.headers }),
});

/* Initialize app */
const app = express();

/* Apply middlewares to app */
app.use(helmet(), rateLimiter, morgan('dev'), cors(), (req, res, next) => {
  if (env !== 'production') {
    /* 
      Enable to see logging information about requests

      console.log(req.headers);
      console.log('------------------');
      console.log(req.body.query);
      console.log('------------------');
      console.log(req.body.variables);
      */
  }
  next();
});

// Expose uploads folder
app.use('/uploads', express.static('uploads'));

// Only if you're behind a reverse proxy
app.enable('trust proxy');

/* Apply apps middlewares to server */
server.applyMiddleware({ app });

const { port } = config.SERVER_OPTIONS;

app.listen(config.SERVER_OPTIONS, () => {
  console.log(
    `GraphQL Server is now running on http://localhost:${port}/graphql`,
  );
});
