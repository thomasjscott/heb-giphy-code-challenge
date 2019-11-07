const express = require('express');
const morgan = require('morgan');

const app = express();

// Routes
const userRouter = require('./routes/userRoutes');
const giphyRouter = require('./routes/giphyRoutes');

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/giphy', giphyRouter);

module.exports = app;
