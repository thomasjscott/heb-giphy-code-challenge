const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ----------------------->
// Routes
// ----------------------->
const userRouter = require('./routes/userRoutes');
const giphyRouter = require('./routes/giphyRoutes');

// ----------------------->
// Global Middlewares
// ----------------------->
// Set security HTTP headers
app.use(helmet());
app.use(cors());

// Prevent parameter polution
app.use(hpp());

// Parse incoming requests into json no matter type
app.use(bodyParser.json({ type: '*/*' }));

// Protect against SQL injection
app.use(mongoSanitize());
app.use(xssClean());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limit: Allow users 100 requests from same IP within 1 hour
const limiter = rateLimit({
  max: 100,
  windowMs: 30 * 60 * 1000,
  message: 'To many requests.  Plese try again later.'
});
app.use('/api', limiter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/giphy', giphyRouter);

// Catch all for any routes that are not defined.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}.`, 404));
});

// Middleware to globally handle errors / failures
app.use(globalErrorHandler);

module.exports = app;
