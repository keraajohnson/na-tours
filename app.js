const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// these apply to every single request we recieve
// express knows we're defining middleware
app.use((req, res, next) => {
  console.log('hello, from the middleware');
  // always use next in middleware
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
