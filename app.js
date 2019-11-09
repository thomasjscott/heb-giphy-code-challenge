const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ----------------------->
// Routes
// ----------------------->
const userRouter = require('./routes/userRoutes');
const giphyRouter = require('./routes/giphyRoutes');

// ----------------------->
// Middlewares
// ----------------------->

// Parse incoming requests into json no matter type
app.use(bodyParser.json({ type: '*/*' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/giphy', giphyRouter);

// Catch all for any routes that are not defined.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}.`, 404));
});

// Middleware to globally handle errors / failures
app.use(globalErrorHandler);

module.exports = app;
